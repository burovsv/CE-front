import * as _ from 'lodash';

function createHierarchicalList(sectionGroupsArray, sectionsArray, articlesArray) {
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

export default createHierarchicalList;