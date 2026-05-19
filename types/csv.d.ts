// CSV files imported via webpack's asset/source loader (configured in
// next.config.mjs) come in as raw strings. This declaration lets TypeScript
// type those imports.

declare module '*.csv' {
  const content: string;
  export default content;
}
