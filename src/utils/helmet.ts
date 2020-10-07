import favicon from 'assets/photos/favicon.png';

const title = 'Chatr';
const description = 'The easiest and fastest way to communite with others and make friends.';

export const helmet = {
  title,
  htmlAttributes: { lang: 'en' },
  meta: [
    { name: 'description', content: description },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, user-scalable=no',
    },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    { name: 'msapplication-navbutton-color', content: '#000' },
    { name: 'msapplication-TileColor', content: '#000' },
    { name: 'theme-color', content: '#000' },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: favicon }],
};
