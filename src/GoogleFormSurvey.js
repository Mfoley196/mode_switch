import React, { useState } from 'react';

const GoogleFormSurvey = (props) => {
  const { pNo, dispatch } = props;

  let src =
    'https://docs.google.com/forms/d/e/1FAIpQLScD4yafH6kjpfTjvYFZx6SyOA9iUW0-aM72L17eo0mT1QkHfA/viewform?embedded=true';

  const [hasLoaded, setHasLoaded] = useState();
  const [loadCount, setLoadCount] = useState(0);

  const SURVEY_PAGES = 7;

  if (typeof pNo !== 'undefined') {
    src = `${src}&entry.676507866=${pNo}`;
  }

  function handleLoad() {
    if (hasLoaded) {
      setLoadCount(loadCount + 1);

      if (loadCount + 1 > SURVEY_PAGES) {
        dispatch({ type: 'next' });
      }
    } else {
      setLoadCount(loadCount + 1);
      setHasLoaded(true);
    }
  }

  return (
    <iframe
      style={{
        width: '100%',
        height: '100vh',
      }}
      // ref='iframe'
      title="Mode Switch Survey"
      src={src}
      frameBorder="0"
      marginHeight="0"
      marginWidth="0"
      onLoad={handleLoad}
    >
      Loading...
    </iframe>
  );
  //https://docs.google.com/forms/d/e/1FAIpQLScD4yafH6kjpfTjvYFZx6SyOA9iUW0-aM72L17eo0mT1QkHfA/viewform?usp=pp_url&entry.676507866=Hi
};

export default GoogleFormSurvey;
