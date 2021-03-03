import { extendTheme } from '@chakra-ui/react';
// import { Global } from '@emotion/react';
import { Styles } from '@chakra-ui/theme-tools';

const styles: Styles = {
  global: {
    'html, body': {
      bg: `gray.100`,
      color: `gray.500`,
    },
  },
};

// const Fonts = () => (
//   <Global
//     styles={`
//     @font-face {
//       font-family: 'Graphik Web Regular';
//       font-display: swap;
//       src:          url('fonts/Graphik-Regular-Web.woff2') format('woff2');
//       font-style:   normal;
//       font-stretch: normal;
//       font-display: swap;
//     }
//     @font-face {
//       font-family: 'Graphik Web Medium';
//       font-display: swap;
//       src:          url('fonts/Graphik-Medium-Web.woff2') format('woff2');
//       font-style:   normal;
//       font-stretch: normal;
//       font-display: swap;
//     }
//     @font-face {
//       font-family: 'Graphik Web Semibold';
//       src:          url('fonts/Graphik-Semibold-Web.woff2') format('woff2');
//       font-style:   normal;
//       font-stretch: normal;
//       font-display: swap;
//     }
//     @font-face {
//       font-family: 'Graphik Web Bold';
//       font-display: swap;
//       src:          url('fonts/Graphik-Bold-Web.woff2') format('woff2');
//       font-style:   normal;
//       font-stretch: normal;
//       font-display: swap;
//     }
//   `}
//   />
// );

const Theme = extendTheme({
  fonts: {
    // body: `"Graphik Web Regular", sans-serif`,
  },
  styles,
});

export { Theme };
