import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | StoryLoom`;
    } else {
      document.title = 'StoryLoom';
    }
  }, [title]);
};

export default usePageTitle;
