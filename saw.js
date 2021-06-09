const saw = {
    criterias: [
        'Kemampuan akademik di alternatif program studi (C1)',
        'Akreditasi perguruan tinggi (C2)',
        'Akreditasi program studi (C3)',
        'Rasio kuota penerimaan dibandingkan dengan peminat (C4)',
        'Peringkat perguruan tinggi secara internasional (C5)',
    ],
    weights: [
        0.4,
        0.3,
        0.1,
        0.1,
        0.1
    ],
    options: [
        ['Sangat buruk', 'Buruk', 'Normal', 'Baik', 'Sangat baik'],
        ['C', 'B', 'A'],
        ['C', 'B', 'A'],
        ['<= 5%', '5% - 10%', '10% - 15%', '15% - 20%', '>20%'],
        ['<= 150', '150 - 200', '200 - 250', '250 - 300', '> 300']
    ],
    rules: [
        'benefit',
        'benefit',
        'benefit',
        'cost',
        'benefit'
    ]
}

var alternatives = []
var labels = []
var SAWResult = []

function normalizeMatrix(mtx) {
    const maxValueEachCriterias = [];
    const minValueEachCriterias = [];
    for (let i = 0; i < saw.options.length; i++) {
        maxValueEachCriterias.push(saw.options[i].length)
        minValueEachCriterias.push(1)
    }
    const newMatrix = []
    for (let i = 0; i < mtx.length; i++) {
        newMatrix.push(mtx[i].map((val, idx) => {
            switch (saw.rules[idx]) {
                case 'benefit':
                    return val / maxValueEachCriterias[idx]
                    break;
                case 'cost':
                    return minValueEachCriterias[idx] / val
                    break;
                default:
                    break;
            }
        }))
    }
    return newMatrix
}

function getSAWValue(normalizedMatrix) {
    let SAWValue = new Array(normalizedMatrix.length).fill(0)

    for (let i = 0; i < normalizedMatrix.length; i++) {
        for (let j = 0; j < normalizedMatrix[i].length; j++) {
            SAWValue[i] += normalizedMatrix[i][j] * saw.weights[j]
        }
    }

    return SAWValue
}

function doSAW(alternatives) {
    let normalizedMatrix = normalizeMatrix(alternatives)
    let result = getSAWValue(normalizedMatrix)
    return result
}

function inputAlternatives() {
    alternatives.push([
        parseInt($('#form1').val()),
        parseInt($('#form2').val()),
        parseInt($('#form3').val()),
        parseInt($('#form4').val()),
        parseInt($('#form5').val())
    ])
    labels.push($('#prodi-alternatif').val())
    // hitung
    SAWResult = doSAW(alternatives)
    pushTable()
}

function pushTable() {
    $('#tbody').html('');
    let content = ''

    let results = labels.map((val, idx) => {
        return {
            labels: val,
            SAWValue: SAWResult[idx]
        }
    })
    
    results.sort((a, b) => (b.SAWValue - a.SAWValue))

    for (let i = 0; i < results.length; i++) {
        content += `
            <tr>
                <td class="text-center">${i + 1}</td>
                <td>${results[i].labels}</td>
                <td>${results[i].SAWValue}</td>
            </tr>
        `;
    }
    $('#tbody').html(content)
    resetField();
}

function resetField() {
    $('#prodi-alternatif').val('');
    $('#form1').val(1);
    $('#form2').val(1);
    $('#form3').val(1);
    $('#form4').val(1);
    $('#form5').val(1);
}
