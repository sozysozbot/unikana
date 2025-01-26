"use strict";
console.assert(convertStageToRuby("{七|なな}") === "<ruby>七<rt>なな</rt></ruby>");
console.assert(convertStageToRuby("{煮|に}ぬ{根|ね}なのにね") === "<ruby>煮<rt>に</rt></ruby>ぬ<ruby>根<rt>ね</rt></ruby>なのにね");
function convertStageToRuby(stage) {
    return stage.replaceAll(/\{([^|{}]+?)\|([^|{}]+?)\}/g, "<ruby>$1<rt>$2</rt></ruby>");
}
console.assert(extractKanaText("{七|なな}") === "なな");
console.assert(extractKanaText("{煮|に}ぬ{根|ね}なのにね") === "にぬねなのにね");
function extractKanaText(stage) {
    return stage.replaceAll(/\{([^|{}]+?)\|([^|{}]+?)\}/g, "$2");
}
