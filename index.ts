// import {
//   FunctionComponent,
//   PropsWithRef
// } from 'react';

// import { Properties, Property } from 'csstype';
// import styled, {
//   CSSObject,
//   DefaultTheme,
//   ExecutionContext,
// } from 'styled-components';
// import {
//   FastOmit,
//   NoInfer,
//   SupportedHTMLElements,
// } from 'styled-components/dist/types';

// import { Breakpoints } from '@/config/theme';

// export type CSSPropExtended<T> = T | ((theme: DefaultTheme) => T) | boolean;

// export type CSSObjectExtended = {
//   [key in keyof CSSObject]: CSSPropExtended<CSSObject[key]>;
// };

// interface SxCustomProps {
//   m: Property.Margin<number>;
//   mr: Property.Margin<number>;
//   ml: Property.Margin<number>;
//   mt: Property.Margin<number>;
//   mb: Property.Margin<number>;
//   mx: Property.Margin<number>;
//   my: Property.Margin<number>;
//   p: Property.Padding<number>;
//   pr: Property.Padding<number>;
//   pl: Property.Padding<number>;
//   pt: Property.Padding<number>;
//   pb: Property.Padding<number>;
//   px: Property.Padding<number>;
//   py: Property.Padding<number>;
//   flex: boolean;
//   flexRow: boolean;
//   flexCol: boolean;
// }

// const sxPropsMapping: {
//   [key in keyof SxCustomProps]: string | string[] | CSSObject;
// } = {
//   m: 'margin',
//   mr: 'marginRight',
//   ml: 'marginLeft',
//   mt: 'marginTop',
//   mb: 'marginBottom',
//   mx: ['marginLeft', 'marginRight'],
//   my: ['marginTop', 'marginBottom'],
//   p: 'padding',
//   pr: 'paddingRight',
//   pl: 'paddingLeft',
//   pt: 'paddingTop',
//   pb: 'paddingBottom',
//   px: ['paddingLeft', 'paddingRight'],
//   py: ['paddingTop', 'paddingBottom'],
//   flex: {
//     display: 'flex',
//   },
//   flexRow: {
//     display: 'flex',
//     flexDirection: 'row',
//   },
//   flexCol: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
// };

// type SxObject = Partial<SxCustomProps> & Properties<number>;

// type Extractor<S> = S extends `$${infer SxKey}` ? SxKey : never;

// type SxObjectExtended = {
//   [key in `$${keyof SxObject}`]?: CSSPropExtended<SxObject[Extractor<key>]>;
// };

// export type CSSProps = {
//   [key in keyof CSSObject]:
//     | CSSPropExtended<CSSObject[key]>
//     | CSSObject[key]
//     | CSSProps;
// };

// const propsToCssObj = (
//   sxProps: object | undefined,
//   onlySx: boolean,
//   theme: DefaultTheme
// ) => {
//   if (!sxProps) {
//     return undefined;
//   }

//   return Object.entries(sxProps).reduce((cssObj, [key, val]): CSSObject => {
//     let prop = null;
//     if (key.startsWith('$')) {
//       key = key.slice(1);
//       prop = sxPropsMapping[key as keyof SxCustomProps] ?? key;
//     } else {
//       prop = sxPropsMapping[key as keyof SxCustomProps];
//     }
//     const value = typeof val === 'function' ? val(theme) : val;

//     return {
//       ...cssObj,
//       ...(Array.isArray(prop)
//         ? prop.reduce(
//             (acc, prop) => ({
//               ...acc,
//               [prop]: value,
//             }),
//             {}
//           )
//         : typeof prop === 'string'
//           ? {
//               [prop]: value,
//             }
//           : typeof prop === 'object'
//             ? prop
//             : !onlySx
//               ? { [key]: value }
//               : null),
//     };
//   }, {});
// };

// type StyledProps<T extends {}> = ExecutionContext &
//   FastOmit<PropsWithRef<T>, keyof NoInfer<T>> &
//   FastOmit<T, keyof SxProps>;

// type StyleFunc<T extends {}> = (props: StyledProps<T>) => CSSObject;

// enum BreakpointQueries {
//   xlDn = 'xlDn',
//   lgDn = 'lgDn',
//   mdDn = 'mdDn',
//   smDn = 'smDn',
//   xsDn = 'xsDn',
//   smUp = 'smUp',
//   mdUp = 'mdUp',
//   lgUp = 'lgUp',
//   xlUp = 'xlUp',
//   xxlUp = 'xxlUp',
// }

// export interface SxProps extends SxObjectExtended {
//   sx?: CSSProps;
//   className?: string;
//   [BreakpointQueries.xlDn]?: CSSProps;
//   [BreakpointQueries.lgDn]?: CSSProps;
//   [BreakpointQueries.mdDn]?: CSSProps;
//   [BreakpointQueries.smDn]?: CSSProps;
//   [BreakpointQueries.xsDn]?: CSSProps;
//   [BreakpointQueries.smUp]?: CSSProps;
//   [BreakpointQueries.mdUp]?: CSSProps;
//   [BreakpointQueries.lgUp]?: CSSProps;
//   [BreakpointQueries.xlUp]?: CSSProps;
//   [BreakpointQueries.xxlUp]?: CSSProps;
// }

// const mediaDownQuery = (breakpoint: number) =>
//   `@media (max-width: ${breakpoint - 0.02}px)`;

// const mediaUpQuery = (breakpoint: number) =>
//   `@media (min-width: ${breakpoint}px)`;

// type SxTarget<T> = FunctionComponent<T> | SupportedHTMLElements;

// const stylelined =
//   <T extends SxProps>(target: SxTarget<T>) =>
//   (style?: (SxObject & CSSObject) | StyleFunc<SxTarget<T>>) => {
//     return styled(target)<T>((props) => {
//       const { theme } = props;
//       const styles = propsToCssObj(
//         typeof style === 'function' ? style(props) : style ?? {},
//         false,
//         theme
//       );
//       return {
//         ...styles,
//         ...propsToCssObj(props, true, theme),
//         ...propsToCssObj(props.sx, false, theme),
//         ...Object.values(BreakpointQueries).reduce((acc, bpQuery) => {
//           const bp = bpQuery.replace(/(Up|Dn)$/g, '') as Breakpoints;
//           const isUp = bpQuery.endsWith('Up');
//           const bpSize = theme.breakpoints[bp];
//           const query = isUp ? mediaUpQuery(bpSize) : mediaDownQuery(bpSize);
//           const bpProps = props[bpQuery];

//           if (bpSize && bpProps) {
//             return {
//               ...acc,
//               [query]: propsToCssObj(bpProps, false, theme),
//             };
//           } else {
//             return acc;
//           }
//         }, {}),
//       };
//     });
//   };

// export default stylelined;
