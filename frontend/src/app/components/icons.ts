// Icons registered in material components.
// Corresponding SVGs must be put in assets folder
const icons = [
    "pregnant",
    "add",
    "edit",
    "visit",
    "check",
    "birth",
    "fetus",
    "lab",
    "mother",
    "baby",
    "disease"
];


export function registerIcons(iconRegistry, sanitizer) {

    icons.forEach((i) => {
        iconRegistry.addSvgIcon(
            i,
            sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${i}.svg`)
        );
    });
}