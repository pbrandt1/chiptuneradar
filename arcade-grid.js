function createArcadeGrid() {
    var numberOfHorizontalLines = 11;
    var numberOfVerticalLines = 7;
    var width = document.getElementById("arcade-overlay").clientWidth,
        height = document.getElementById("arcade-overlay").clientHeight;
    var gridHeight = height/(numberOfHorizontalLines - 1);
    var gridWidth = width/(numberOfVerticalLines - 1);
    var skinnyGridWidth = width/(numberOfVerticalLines + 1);
    var viewBox = '0 0 width height'.replace('width', width).replace('height', height);

    var svgText = "";
    var lineTemplate = '<line y1="Y1" y2="Y2" x1="X1" x2="X2" stroke-width=".5" stroke="#FFFFFF" fill="none"/>\n';

    for (var i = 1; i <= numberOfHorizontalLines; i++) {
        var y = height - Math.log(i)/Math.log(numberOfHorizontalLines) * height
        svgText += lineTemplate
            .replace('Y1', y)
            .replace('Y2', y)
            .replace('X1', skinnyGridWidth - y/height * skinnyGridWidth)
            .replace('X2', width - skinnyGridWidth + y/height * skinnyGridWidth);
    }

    for (var i = 0; i < numberOfVerticalLines; i++) {
        svgText += lineTemplate
            .replace('Y1', '0')
            .replace('Y2', height)
            .replace('X1', (i + 1) * skinnyGridWidth)
            .replace('X2', i*gridWidth);
    }

    document.getElementById('arcade-grid').setAttribute('viewBox', viewBox);
    document.getElementById('arcade-grid').innerHTML = "<g>" + svgText + "</g>";
}

module.exports = createArcadeGrid;
