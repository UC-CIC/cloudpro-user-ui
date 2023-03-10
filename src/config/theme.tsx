import { extendTheme, theme as baseTheme, theme } from '@chakra-ui/react';

// // 2. Objects can be created inside the extendTheme function or elsewhere and imported
// const colors = {
//   primaryFontColor: {
//     lightMode: baseTheme.colors["700"],
//     darkMode: baseTheme.gray["200"],
//   },
//   secondaryFontColor: {
//     lightMode: baseTheme.gray["600"],
//     darkMode: baseTheme.gray["400"],
//   },
//   plainOldBlue: "blue"
// }

// 3. Call `extendTheme` and pass your custom values
const customTheme = extendTheme({
  // colors: colors,

  components: {
    Checkbox: {
      variants: {
        // TODO: HOW TO MODIFY LABEL?
        compact: (props: any) => {
          return {
            label: {
              marginStart: 0,
              marginTop: props.spacing || '0.5rem',
            },
          };
        },
      },
    },
    Text: {
      baseStyle: (props: any) => ({
        color:
          props.colorMode === 'dark'
            ? baseTheme.colors.whiteAlpha['900']
            : baseTheme.colors.blackAlpha['900'],
      }),
      // variants: {
      //   // used as <Text variant="secondary">
      //   secondary: props => ({
      //     color: mode(
      //       colors.primaryFontColor.lightMode,
      //       colors.primaryFontColor.darkMode
      //     )(props),
      //   }),
      // },
    },
  },

  // styles: {
  //   global: props => ({
  //     // Optionally set global CSS styles
  //     body: {
  //       color: mode(
  //         colors.primaryFontColor.lightMode,
  //         colors.primaryFontColor.darkMode
  //       )(props),
  //     },
  //   }),
  // },
});

export default customTheme;
