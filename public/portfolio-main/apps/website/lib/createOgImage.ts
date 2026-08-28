// double escape for commas and slashes
const e = (str: string) => encodeURIComponent(encodeURIComponent(str));

export const createOgImage = ({
  title,
  meta,
}: {
  title: string;
  meta: string;
}) =>
  [
    // ACCOUNT PREFIX
    `https://res.cloudinary.com/bucha/image/upload`,
    // Canvas
    `w_1600,h_836,q_100`,

    // TITLE — Karla bold, primary text colour
    `l_text:Karla_72_bold:${e(title)},co_rgb:ffe4e6,c_fit,w_1400,h_220`,
    `fl_layer_apply,g_south_west,x_100,y_280`,

    // META — Karla regular, lighter opacity, capped to a single band
    `l_text:Karla_36:${e(meta)},co_rgb:ffe4e6cc,c_fit,w_1400,h_140`,
    `fl_layer_apply,g_south_west,x_100,y_100`,

    // BG
    `grain-gradient_ctrjnp.png`,
  ].join('/');
