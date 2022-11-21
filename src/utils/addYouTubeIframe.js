export const addYouTubeIframe = (desc) => {
  //   const regRule = ;
  //   const match = regRule.exec(desc);
  //   console.log(match);
  let newDesc = desc;
  console.log(desc);
  if (newDesc) {
    const links = desc.match(/\[video\]([\s\S]*?)\[\/video\]/gm);
    links?.map((link) => {
      let linkNotTag = link.replace('[video]', '').replace('[/video]', '');
      const youTube = youTubeIframe(linkNotTag);
      newDesc = newDesc.replace(link, youTube);
    });
    console.log(newDesc);
    return newDesc;
  }

  return '';
};

const youTubeIframe = (link) => {
  return `
     <iframe width="560" height="315" src="${link}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
};
