import { saverLevelsImages, saverLevelsNames, saverLevelType } from "../store/rewards/types";

export const constantsSaverLevels: Array<saverLevelType> = [
    {
        name: saverLevelsNames.level1,
        image: saverLevelsImages.bronzeImage,
        expNecesary: 400
    },
    {
        name: saverLevelsNames.level2,
        image: saverLevelsImages.bronzeImage,
        expNecesary: 800
    },
    {
        name: saverLevelsNames.level3,
        image: saverLevelsImages.silverImage,
        expNecesary: 1400
    },
    {
        name: saverLevelsNames.level4,
        image: saverLevelsImages.silverImage,
        expNecesary: 2200
    },
    {
        name: saverLevelsNames.level5,
        image: saverLevelsImages.silverImage,
        expNecesary: 3200
    },
    {
        name: saverLevelsNames.level6,
        image: saverLevelsImages.goldImage,
        expNecesary: 4400
    },
    {
        name: saverLevelsNames.level7,
        image: saverLevelsImages.goldImage,
        expNecesary: 5800
    },
    {
        name: saverLevelsNames.level8,
        image: saverLevelsImages.diamondImage,
        expNecesary: 7400
    },
    {
        name: saverLevelsNames.level9,
        image: saverLevelsImages.goldImage,
        expNecesary: 9200
    },
    {
        name: saverLevelsNames.level10,
        image: saverLevelsImages.maxImage,
        expNecesary: 11200
    }
]