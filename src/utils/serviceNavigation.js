export function getServiceSectionGroups(sections = []) {
  return sections.reduce((items, section, sectionIndex) => {
    if (!section.section_group) {
      items.push({ type: "section", section, sectionIndex });
      return items;
    }

    const last = items[items.length - 1];
    if (last && last.type === "group" && last.group === section.section_group) {
      last.sections.push({ section, sectionIndex });
    } else {
      items.push({
        type: "group",
        group: section.section_group,
        groupTitlePhrase: section.section_group_title_phrase,
        sections: [{ section, sectionIndex }]
      });
    }
    return items;
  }, []);
}

export function getServiceNavigation(serviceText) {
  if (!serviceText) return [];

  return [
    {
      type: "service",
      title: serviceText.nav_title || serviceText.short_title || serviceText.title,
      items: getServiceSectionGroups(serviceText.sections || [])
    }
  ];
}
