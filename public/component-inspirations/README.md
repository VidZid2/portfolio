# Component & Website Inspirations SVGs

Drop your SVG icons or logos here!

### How to use them in the portfolio:
1. Place your `.svg` file in this folder (e.g. `public/component-inspirations/shadcn.svg`).
2. In `src/components/SupportedBySection.tsx`, add it to the `INSPIRATIONS` array:
```ts
{
  name: "shadcn/ui",
  url: "https://ui.shadcn.com",
  svgPath: "/component-inspirations/shadcn.svg"
}
```
3. The component will automatically display and animate your custom SVGs across the blueprint grid!
