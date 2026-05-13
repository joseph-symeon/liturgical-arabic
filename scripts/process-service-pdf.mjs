import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);

function usage() {
  console.error(`Usage: node scripts/process-service-pdf.mjs <pdf-path> [options]

Creates a temporary visual review workspace for a bilingual service PDF.
It renders pages, splits Arabic/English columns, finds likely section headings,
and creates rough section crop packets. It does not create app data.

Options:
  --out-dir <path>       Output root. Default: /private/tmp/liturgy-pdf-workspaces
  --slug <name>          Workspace folder name. Default: PDF basename
  --dpi <number>         Render DPI. Default: 220
  --force                Replace an existing workspace
  --enhance-review       Also create sharpened/contrast review images.
                        Originals remain the source authority.
  --ocr-headings         Use Tesseract TSV on English columns for title-case heading candidates.
                        Auto section packets require recognized heading text.
  --no-red-headings      Disable visual red heading candidates
  --break <page:y:slug>  Curated section break. Can be repeated, e.g. --break 1:154:catechumens

Outputs:
  pages/                 Rendered full-page PNGs
  columns/               Per-page Arabic and English crops
  columns-enhanced/      Optional sharpened/contrast review crops
  heading-candidates/    Cropped candidate heading images
  heading-candidates-contact-sheet.jpg
  sections/              Rough section packets from curated or text-detected breaks
  sections-enhanced/     Optional enhanced copies of section packet images
  manifest.json
`);
}

function takeFlag(name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  args.splice(index, 2);
  return value;
}

function hasFlag(name) {
  const index = args.indexOf(name);
  if (index === -1) return false;
  args.splice(index, 1);
  return true;
}

function takeRepeated(name) {
  const values = [];
  for (;;) {
    const index = args.indexOf(name);
    if (index === -1) break;
    values.push(args[index + 1]);
    args.splice(index, 2);
  }
  return values;
}

function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase() || 'service-pdf';
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
    ...options
  });
  if (result.status !== 0) {
    const details = [result.stdout, result.stderr].filter(Boolean).join('\n');
    throw new Error(`${command} failed with status ${result.status}${details ? `\n${details}` : ''}`);
  }
  return result;
}

const outRoot = resolve(takeFlag('--out-dir') || '/private/tmp/liturgy-pdf-workspaces');
const slugArg = takeFlag('--slug');
const dpi = Number(takeFlag('--dpi') || 220);
const force = hasFlag('--force');
const enhanceReview = hasFlag('--enhance-review');
const useOcrHeadings = hasFlag('--ocr-headings');
const useRedHeadings = !hasFlag('--no-red-headings');
const curatedBreakArgs = takeRepeated('--break');

const wantsHelp = hasFlag('--help');
if (wantsHelp || args.length !== 1) {
  usage();
  process.exit(wantsHelp ? 0 : 1);
}

const pdfPath = resolve(args[0]);
if (!existsSync(pdfPath)) {
  throw new Error(`PDF not found: ${pdfPath}`);
}
if (!Number.isFinite(dpi) || dpi <= 0) {
  throw new Error(`Invalid --dpi value: ${dpi}`);
}

const slug = slugify(slugArg || basename(pdfPath, extname(pdfPath)));
const workspace = join(outRoot, slug);
const pagesDir = join(workspace, 'pages');
const columnsDir = join(workspace, 'columns');
const enhancedColumnsDir = join(workspace, 'columns-enhanced');
const candidatesDir = join(workspace, 'heading-candidates');
const sectionsDir = join(workspace, 'sections');
const enhancedSectionsDir = join(workspace, 'sections-enhanced');

if (existsSync(workspace)) {
  if (!force) {
    throw new Error(`Workspace already exists: ${workspace}\nUse --force to replace it.`);
  }
  rmSync(workspace, { recursive: true, force: true });
}

mkdirSync(pagesDir, { recursive: true });
mkdirSync(columnsDir, { recursive: true });
if (enhanceReview) {
  mkdirSync(enhancedColumnsDir, { recursive: true });
  mkdirSync(enhancedSectionsDir, { recursive: true });
}
mkdirSync(candidatesDir, { recursive: true });
mkdirSync(sectionsDir, { recursive: true });

console.log(`Rendering PDF to ${pagesDir}`);
run('gs', [
  '-dSAFER',
  '-dBATCH',
  '-dNOPAUSE',
  '-sDEVICE=png16m',
  `-r${dpi}`,
  `-sOutputFile=${join(pagesDir, 'page-%03d.png')}`,
  pdfPath
], { stdio: 'inherit' });

const pythonScript = String.raw`
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps
import json, math, os, re, subprocess, sys

workspace = Path(sys.argv[1])
use_red = sys.argv[2] == "1"
use_ocr = sys.argv[3] == "1"
curated = json.loads(sys.argv[4])
enhance_review = sys.argv[6] == "1"

pages_dir = workspace / "pages"
columns_dir = workspace / "columns"
enhanced_columns_dir = workspace / "columns-enhanced"
candidates_dir = workspace / "heading-candidates"
sections_dir = workspace / "sections"
enhanced_sections_dir = workspace / "sections-enhanced"

def enhance_for_review(img):
    gray = ImageOps.autocontrast(img.convert("L"), cutoff=1)
    sharp = gray.filter(ImageFilter.UnsharpMask(radius=1.2, percent=180, threshold=3))
    return ImageEnhance.Contrast(sharp).enhance(1.45)

def crop_boxes(width, height):
    return {
        "en": (round(width * 0.035), round(height * 0.065), round(width * 0.430), round(height * 0.945)),
        "ar": (round(width * 0.580), round(height * 0.065), round(width * 0.975), round(height * 0.945)),
    }

def red_components(img):
    pix = img.convert("RGB")
    w, h = pix.size
    data = pix.load()
    mask = bytearray(w*h)
    for y in range(h):
        for x in range(w):
            r,g,b = data[x,y]
            if r > 105 and r > g * 1.16 and r > b * 1.12 and (r-g) > 18 and (r-b) > 18:
                mask[y*w+x] = 1
    seen = bytearray(w*h)
    comps = []
    for i,v in enumerate(mask):
        if not v or seen[i]:
            continue
        stack=[i]; seen[i]=1
        xs=[]; ys=[]; count=0
        while stack:
            j=stack.pop(); count += 1
            x=j%w; y=j//w
            xs.append(x); ys.append(y)
            for nx,ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                if 0 <= nx < w and 0 <= ny < h:
                    k=ny*w+nx
                    if mask[k] and not seen[k]:
                        seen[k]=1; stack.append(k)
        if count >= 12:
            comps.append((min(xs), min(ys), max(xs)+1, max(ys)+1, count))
    return comps

def merge_red_lines(comps, w, h):
    useful=[]
    for x1,y1,x2,y2,count in comps:
        bw=x2-x1; bh=y2-y1
        if y1 < 10 or y2 > h-10 or x1 < 8 or x2 > w-8:
            continue
        if bh < 8 or count < 18:
            continue
        useful.append((x1,y1,x2,y2,count))
    useful.sort(key=lambda c: c[1])
    lines=[]
    for x1,y1,x2,y2,count in useful:
        placed=False
        for line in lines:
            if y1 <= line["y2"]+12 and y2 >= line["y1"]-12:
                line["x1"]=min(line["x1"],x1); line["y1"]=min(line["y1"],y1)
                line["x2"]=max(line["x2"],x2); line["y2"]=max(line["y2"],y2)
                line["score"] += count
                placed=True
                break
        if not placed:
            lines.append({"x1":x1,"y1":y1,"x2":x2,"y2":y2,"score":count})
    candidates=[]
    for line in lines:
        bw=line["x2"]-line["x1"]; bh=line["y2"]-line["y1"]; cx=(line["x1"]+line["x2"])/2
        centered = 0.22*w < cx < 0.78*w
        if bw >= 110 and bh >= 16 and centered:
            line["kind"] = "red-centered"
            line["text"] = ""
            candidates.append(line)
    return candidates

def title_case_score(text):
    words = [w for w in re.split(r"\s+", text.strip()) if w]
    if len(words) < 3:
        return 0
    alpha = [w.strip("()[]{}:;,.!?") for w in words if re.search(r"[A-Za-z]", w)]
    if len(alpha) < 3:
        return 0
    titleish = 0
    small = {"of","the","and","for","to","in","a","an","with","before","after"}
    for w in alpha:
        low = w.lower()
        if low in small:
            titleish += 0.5
        elif w[:1].isupper():
            titleish += 1
    return titleish / len(alpha)

def ocr_title_candidates(path, img):
    result = subprocess.run(
        ["tesseract", str(path), "stdout", "-l", "eng", "--psm", "6", "tsv"],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL
    )
    if result.returncode != 0:
        return []
    lines = {}
    rows = result.stdout.splitlines()
    if not rows:
        return []
    header = rows[0].split("\t")
    index = {name:i for i,name in enumerate(header)}
    needed = ["block_num","par_num","line_num","left","top","width","height","conf","text"]
    if any(k not in index for k in needed):
        return []
    for row in rows[1:]:
        cells = row.split("\t")
        if len(cells) <= max(index.values()):
            continue
        text = cells[index["text"]].strip()
        if not text:
            continue
        try:
            conf = float(cells[index["conf"]])
            if conf < 35:
                continue
            left = int(cells[index["left"]]); top = int(cells[index["top"]])
            width = int(cells[index["width"]]); height = int(cells[index["height"]])
        except ValueError:
            continue
        key=(cells[index["block_num"]], cells[index["par_num"]], cells[index["line_num"]])
        line = lines.setdefault(key, {"words":[], "x1":left, "y1":top, "x2":left+width, "y2":top+height})
        line["words"].append(text)
        line["x1"]=min(line["x1"],left); line["y1"]=min(line["y1"],top)
        line["x2"]=max(line["x2"],left+width); line["y2"]=max(line["y2"],top+height)
    out=[]
    w,h = img.size
    for line in lines.values():
        text = " ".join(line["words"])
        score = title_case_score(text)
        cx=(line["x1"]+line["x2"])/2
        centered = 0.18*w < cx < 0.82*w
        if centered and score >= 0.62 and (line["x2"]-line["x1"]) >= 180:
            line["kind"] = "ocr-title-case"
            line["text"] = text
            line["score"] = round(score, 3)
            out.append(line)
    return out

def save_candidate_image(crop, cand, page, side, ordinal):
    pad=35
    x1=max(0, cand["x1"]-pad); y1=max(0, cand["y1"]-pad)
    x2=min(crop.width, cand["x2"]+pad); y2=min(crop.height, cand["y2"]+pad)
    out = candidates_dir / f"page-{page:03d}-{side}-{ordinal:02d}-y{cand['y1']:04d}-{cand['kind']}.png"
    crop.crop((x1,y1,x2,y2)).save(out)
    return out

pages = []
candidates = []
for page_path in sorted(pages_dir.glob("page-*.png")):
    match = re.search(r"(\d+)", page_path.stem)
    page = int(match.group(1))
    img = Image.open(page_path)
    boxes = crop_boxes(img.width, img.height)
    page_record = {"page": page, "width": img.width, "height": img.height, "columns": boxes}
    if enhance_review:
        page_record["enhanced_columns"] = {
            side: f"columns-enhanced/page-{page:03d}-{side}.png"
            for side in boxes
        }
    pages.append(page_record)
    for side, box in boxes.items():
        crop = img.crop(box)
        column_path = columns_dir / f"page-{page:03d}-{side}.png"
        crop.save(column_path)
        if enhance_review:
            enhanced_column_path = enhanced_columns_dir / f"page-{page:03d}-{side}.png"
            enhance_for_review(crop).save(enhanced_column_path)
        side_candidates = []
        if use_red:
            side_candidates.extend(merge_red_lines(red_components(crop), crop.width, crop.height))
        if use_ocr and side == "en":
            side_candidates.extend(ocr_title_candidates(column_path, crop))
        side_candidates.sort(key=lambda c: (c["y1"], c["x1"]))
        for ordinal, cand in enumerate(side_candidates, 1):
            candidate_path = save_candidate_image(crop, cand, page, side, ordinal)
            candidates.append({
                "page": page,
                "side": side,
                "y": cand["y1"],
                "y2": cand["y2"],
                "x1": cand["x1"],
                "x2": cand["x2"],
                "kind": cand["kind"],
                "text": cand.get("text", ""),
                "score": cand.get("score", 0),
                "path": str(candidate_path.relative_to(workspace)),
            })

# Contact sheet.
tiles=[]
for idx, cand in enumerate(candidates, 1):
    im = Image.open(workspace / cand["path"]).convert("RGB")
    im.thumbnail((360,95))
    tile = Image.new("RGB", (380, 135), "white")
    tile.paste(im, (10, 30))
    dr = ImageDraw.Draw(tile)
    label = f"{idx:02d} p{cand['page']:03d} {cand['side']} y{cand['y']} {cand['kind']}"
    dr.text((10, 5), label, fill=(0,0,0))
    if cand["text"]:
        dr.text((10, 118), cand["text"][:58], fill=(0,0,0))
    tiles.append(tile)
cols = 3
rows = max(1, math.ceil(len(tiles)/cols))
sheet = Image.new("RGB", (cols*380, rows*135), "white")
for i,tile in enumerate(tiles):
    sheet.paste(tile, ((i%cols)*380, (i//cols)*135))
sheet_path = workspace / "heading-candidates-contact-sheet.jpg"
sheet.save(sheet_path, quality=92)

def make_sections(breaks):
    section_records=[]
    if not breaks:
        # A visual mark alone is useful for review, but it is not enough to
        # identify a section. Auto section breaks must have recognized text.
        source = [
            c for c in candidates
            if c["side"] == "en"
            and c["kind"] == "ocr-title-case"
            and c.get("text", "").strip()
        ]
        breaks = []
        for i,c in enumerate(sorted(source, key=lambda c: (c["page"], c["y"])), 1):
            slug = c["text"]
            slug = re.sub(r"[^A-Za-z0-9]+", "-", slug).strip("-").lower() or f"section-{i:03d}"
            breaks.append({"page": c["page"], "y": c["y"], "slug": slug, "title_guess": c["text"], "source": c["kind"]})
    breaks = sorted(breaks, key=lambda b: (b["page"], b["y"]))
    if not breaks:
        return []
    sentinel = {"page": pages[-1]["page"] + 1, "y": 0, "slug": "end"}
    all_breaks = breaks + [sentinel]
    for i,b in enumerate(breaks,1):
        nb = all_breaks[i]
        sec_id = f"{i:03d}-{b['slug']}"
        secdir = sections_dir / sec_id
        secdir.mkdir(exist_ok=True)
        enhanced_secdir = enhanced_sections_dir / sec_id
        if enhance_review:
            enhanced_secdir.mkdir(exist_ok=True)
        files=[]
        enhanced_files=[]
        for p in range(b["page"], min(nb["page"], pages[-1]["page"]) + 1):
            for side in ["en","ar"]:
                src = columns_dir / f"page-{p:03d}-{side}.png"
                if not src.exists():
                    continue
                im = Image.open(src)
                top = b["y"] if p == b["page"] else 0
                bottom = nb["y"] if p == nb["page"] else im.height
                if p == b["page"] and p == nb["page"]:
                    bottom = nb["y"]
                top=max(0, top-20); bottom=min(im.height, bottom+20)
                if bottom <= top + 40:
                    continue
                out = secdir / f"page-{p:03d}-{side}.png"
                crop = im.crop((0,top,im.width,bottom))
                crop.save(out)
                files.append(str(out.relative_to(workspace)))
                if enhance_review:
                    enhanced_out = enhanced_secdir / f"page-{p:03d}-{side}.png"
                    enhance_for_review(crop).save(enhanced_out)
                    enhanced_files.append(str(enhanced_out.relative_to(workspace)))
        record = {
            "id": sec_id,
            "title_guess": b.get("title_guess", ""),
            "start": {"page": b["page"], "y": b["y"]},
            "end": {"page": nb["page"], "y": nb["y"]},
            "source": b.get("source", "curated"),
            "files": files
        }
        if enhance_review:
            record["enhanced_files"] = enhanced_files
        section_records.append(record)
    return section_records

sections = make_sections(curated)

manifest = {
    "source_pdf": sys.argv[5],
    "workspace": str(workspace),
    "pages": pages,
    "heading_detection": {
        "red_centered": use_red,
        "ocr_title_case": use_ocr
    },
    "review_enhancement": {
        "enabled": enhance_review,
        "method": "grayscale autocontrast + unsharp mask + contrast",
        "authority": "original page and column crops"
    },
    "heading_candidates": candidates,
    "contact_sheet": str(sheet_path.relative_to(workspace)),
    "sections": sections
}
(workspace / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps({
    "workspace": str(workspace),
    "pages": len(pages),
    "columns": len(list(columns_dir.glob("*.png"))),
    "enhanced_columns": len(list(enhanced_columns_dir.glob("*.png"))) if enhance_review else 0,
    "heading_candidates": len(candidates),
    "sections": len(sections)
}, indent=2))
`;

const curatedBreaks = curatedBreakArgs.map((value) => {
  const [page, y, ...slugParts] = String(value).split(':');
  if (!page || !y || slugParts.length === 0) {
    throw new Error(`Invalid --break "${value}". Expected page:y:slug`);
  }
  const pageNumber = Number(page);
  const yNumber = Number(y);
  if (!Number.isInteger(pageNumber) || !Number.isInteger(yNumber)) {
    throw new Error(`Invalid --break "${value}". Page and y must be integers.`);
  }
  return {
    page: pageNumber,
    y: yNumber,
    slug: slugify(slugParts.join(':')),
    source: 'curated'
  };
});

const pythonResult = run('python3', [
  '-c',
  pythonScript,
  workspace,
  useRedHeadings ? '1' : '0',
  useOcrHeadings ? '1' : '0',
  JSON.stringify(curatedBreaks),
  pdfPath,
  enhanceReview ? '1' : '0'
]);

const summary = JSON.parse(pythonResult.stdout);
const manifestPath = join(workspace, 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

writeFileSync(
  join(workspace, 'README.txt'),
  [
    'Temporary visual PDF review workspace.',
    '',
    `Source PDF: ${pdfPath}`,
    `Manifest: ${manifestPath}`,
    `Contact sheet: ${join(workspace, manifest.contact_sheet)}`,
    enhanceReview ? `Enhanced review crops: ${join(workspace, 'columns-enhanced')}` : null,
    '',
    'This workspace is for visual review only. Do not treat OCR or heading guesses as trusted text.',
    'When enhanced review crops are present, use them only as reading aids; originals remain authoritative.',
    ''
  ].filter((line) => line !== null).join('\n'),
  'utf8'
);

console.log(`Workspace: ${summary.workspace}`);
console.log(`Pages: ${summary.pages}`);
console.log(`Column crops: ${summary.columns}`);
if (enhanceReview) {
  console.log(`Enhanced column crops: ${summary.enhanced_columns}`);
}
console.log(`Heading candidates: ${summary.heading_candidates}`);
console.log(`Section packets: ${summary.sections}`);
console.log(`Contact sheet: ${join(workspace, manifest.contact_sheet)}`);
console.log(`Manifest: ${manifestPath}`);
