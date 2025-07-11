export default {
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm'],
  outDir: 'dist',
  sourceMap: true,
  clean: true,
  watch: process.env.WATCH === 'true',
};
