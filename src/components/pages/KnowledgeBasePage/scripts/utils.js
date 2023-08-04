import * as _ from 'lodash';

export function createHierarchicalList(sectionGroupsArray, sectionsArray, articlesArray) {
    //   создать массив иерархических групп разделов
    let hierarchicalList = [];

    _.forEach(sectionGroupsArray, (sectionGroup) => {
        let id = sectionGroup.id;
        let sectionGroupChildren = [];
        _.forEach(sectionsArray, (section) => {
            if (section.parent == id) {
                let sectionChildren = [];
                _.forEach(articlesArray, (article) => {
                    if (article.parent == section.id) sectionChildren.push(article);
                })
                if (!_.isEmpty(sectionChildren)) {
                    section.children = sectionChildren;
                    sectionGroupChildren.push(section, ...sectionChildren)
                    sectionGroup.children = sectionGroupChildren;
                };
            }
        });
        if (!_.isEmpty(sectionGroupChildren)) hierarchicalList.push(sectionGroup, ...sectionGroupChildren);

    });

    return hierarchicalList;
}

export const collapseHierarchicalGroup = (group, initHierarchicalList) => {
    const hierarchicalList = _.cloneDeep(initHierarchicalList);
    const foundGroup = _.find(hierarchicalList, { id: group.id, level: group.level });
    const isCollapsed = !foundGroup?.isCollapsed
    foundGroup.isCollapsed = isCollapsed;
    foundGroup.isHide = false;

    if (foundGroup?.children) {
        _.forEach(foundGroup.children, (child) => {
            child.isHide = isCollapsed;
            child.isCollapsed = isCollapsed;
        });
    }

    return hierarchicalList;
}

export const initHierarchicalItem = (el, level, parent = null, isGroup = false, isCollapsed = false) => {
    return {
        id: el.id,
        name: el.name,
        parent: parent,
        isGroup: isGroup,
        isCollapsed: isCollapsed,
        level: level,
        children: (el?.children) ? el.children : null,
        data: el
    }
}