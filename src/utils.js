export const extractDomainFromURL = (url) => {
  try {
    const domainRegex = /^(?:https?:\/\/)?(www\.)?([^:/\n?]+)/;
    const matches = url.match(domainRegex);

    if (matches && matches.length >= 3) {
      const wwwPrefix = matches[1] || ''; // Capture 'www.' or an empty string
      const domain = matches[2];

      return wwwPrefix + domain;
    } else {
      throw new Error('Invalid URL format');
    }
  } catch (error) {
    console.log('Error | extracting domain:', error.message);
    return 'void';
  }
};

export const validateFaviconURL = (url) => {
  try {
    const urlRegex =
      /^(https?:\/\/)?([a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})+)([/?].*)?$/;
    if (!url.match(urlRegex)) {
      return false;
    }

    return true;
  } catch (error) {
    console.log('Error | validating favicon URL:', error.message);
    return false;
  }
};

export const truncateTabTitle = (str) => {
  if (str.length > 75) {
    return str.slice(0, 75 - 3) + '...';
  } else {
    return str;
  }
};
