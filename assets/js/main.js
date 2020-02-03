import "./prism";
import "material-design-lite";
import "jquery";
import "baguettebox.js";
import "exif-js";

baguetteBox.run(".post > section");

baguetteBox.run('.gallery');

$(function () {
    $(".post > section img").not(".no-exif").each(function (index, element) {
        addExifInfoForFigure(element);
    });
});

function addExifInfoForFigure(imageElement) {
    if (!imageElement) return;

    imageElement = $(imageElement);

    if (isEmpty(imageElement.attr("src"))) return;

    let element;
    if (imageElement.parent().get(0) && (imageElement.parent().get(0).tagName === "a" || imageElement.parent().get(0).tagName === "A")) {
        element = imageElement.parent();
    } else {
        element = imageElement;
    }

    element.wrap("<figure></figure>");

    EXIF.getData(imageElement.get(0), function () {
        const title = imageElement.attr("alt"),
            iso = EXIF.getTag(this, "ISOSpeedRatings"),
            aperture = EXIF.getTag(this, "FNumber"),
            exposure = EXIF.getTag(this, "ExposureTime"),
            focalLength = EXIF.getTag(this, "FocalLength");


        if (!isEmpty(title) || !isEmpty(iso) || !isEmpty(aperture) || !isEmpty(exposure) || !isEmpty(focalLength)) {

            const figcaption = $("<figcaption></figcaption>");

            //Title
            if (!isEmpty(title)) {
                const headline = $("<h5>" + title + "</h5>");
                figcaption.append(headline);
            }

            //Exif data
            if (!isEmpty(iso) || !isEmpty(aperture) || !isEmpty(exposure) || !isEmpty(focalLength)) {
                let info = $("<span></span>"),
                    first = true,
                    html = "";

                if (!isEmpty(iso)) {
                    if (first) {
                        first = false;
                    }
                    html += "ISO " + iso;
                }
                if (!isEmpty(aperture)) {
                    if (first) {
                        first = false;
                    } else {
                        html += " • "
                    }
                    html += "f/" + aperture;
                }
                if (!isEmpty(exposure)) {
                    if (first) {
                        first = false;
                    } else {
                        html += " • "
                    }
                    if (exposure >= 1) {
                        html += exposure + "s";
                    } else {
                        html += "1/" + (1 / exposure) + "s";
                    }
                }
                if (!isEmpty(focalLength)) {
                    if (first) {
                        first = false;
                    } else {
                        html += " • "
                    }
                    html += focalLength + "mm";
                }

                info.html(html);

                figcaption.append(info);
            }

            figcaption.insertAfter(element);
        }
    });
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}
