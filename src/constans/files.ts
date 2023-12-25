export const validFileExtensions = {
  image: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
};

export const isValidFileType = (fileName: string, fileType: 'image') => {
  if (!fileName || !fileType) return false;
  const fileExt = fileName.split('.').pop();
  if (!fileExt) return false;
  return validFileExtensions[fileType].includes(fileExt);
};

export const isValidFile = (fileName: string, fileExtension: 'jpg' | 'png' | 'jpeg' | 'webp' | 'pdf') => {
  if (!fileName || !fileExtension) return false;
  const fileExt = fileName.split('.').pop();
  if (!fileExt) return false;
  return fileExt === fileExtension;
};
