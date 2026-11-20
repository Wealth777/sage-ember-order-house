import burger from "@/assets/food/burger.jpg";
import burrata from "@/assets/food/burrata.jpg";
import caesar from "@/assets/food/caesar.jpg";
import calamari from "@/assets/food/calamari.jpg";
import cheesecake from "@/assets/food/cheesecake.jpg";
import chicken from "@/assets/food/chicken.jpg";
import hibiscus from "@/assets/food/hibiscus.jpg";
import lavaCake from "@/assets/food/lava-cake.jpg";
import lemonade from "@/assets/food/lemonade.jpg";
import linguine from "@/assets/food/linguine.jpg";
import quinoa from "@/assets/food/quinoa.jpg";
import ribeye from "@/assets/food/ribeye.jpg";
import salmon from "@/assets/food/salmon.jpg";
import skewers from "@/assets/food/skewers.jpg";
import tagliatelle from "@/assets/food/tagliatelle.jpg";

/** Bundled food photography, referenced from menu items by key. */
export const FOOD_IMAGES: Record<string, string> = {
  burger,
  burrata,
  caesar,
  calamari,
  cheesecake,
  chicken,
  hibiscus,
  "lava-cake": lavaCake,
  lemonade,
  linguine,
  quinoa,
  ribeye,
  salmon,
  skewers,
  tagliatelle,
};

export function resolveImage(image: string) {
  return FOOD_IMAGES[image] ?? image;
}
