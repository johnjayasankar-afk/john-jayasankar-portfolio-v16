import sprite from "@/assets/backers-sprite.svg?raw";

export function BackersSprite() {
  return <div dangerouslySetInnerHTML={{ __html: sprite }} />;
}
