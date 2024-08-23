function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function square(number) {
    return number * number
}

function squareRoot(number) {
    return Math.sqrt(number)
}

function round(number) {
    return (number >= 0) ? Math.floor(number + 0.5) : Math.ceil(number - 0.5)
}

let bg, selectedMapElement, selectedMap, previousMap,
    findtreasuresVar = false

function setupMap(randMap) {
    if (randMap <= 50) {
        bg = createMapImage("../img/map.jpg", "firstMap")
        selectedMap = "firstMap"
        document.body.style.backgroundColor = "#fff"
    } else if (randMap > 50 && randMap <= 75) {
        bg = createMapImage("../img/narnya.jpg", "narnya")
        document.body.style.backgroundColor = "#343434"
        selectedMap = "narnya"
    } else {
        bg = createMapImage("../img/one-peace-map.jpg", "one-peace")
        document.body.style.backgroundColor = "#576b6d"
        selectedMap = "one-peace"
    }

    selectedMapElement = bg
    document.body.appendChild(bg)

    if (selectedMap === "firstMap" && !localStorage.getItem('alertShown')) {
        alert("Шо, думали тут буде невеличка піратська карта? Нє, шукайте його по всій майбутній Європі.")
        localStorage.setItem('alertShown', 'true')
    }

    newtreasuresCross()

    return selectedMap
}

function removeAllMarks() {
    document.querySelectorAll('#cross').forEach(cross => cross.remove())
}

function changeMap(randMap) {
    removeAllMarks()
    previousMap = selectedMap

    if (selectedMapElement) {
        document.body.removeChild(selectedMapElement)
    }

    setupMap(randMap)
    if (selectedMap === previousMap) {
        while (selectedMap !== previousMap) {
            setupMap(randMap)
        }
    }
    selectedMapElement = bg
    if (level < 3) {
        level++
    }
    findtreasuresVar = false
    return selectedMap
}

function createMapImage(src, id) {
    let img = document.createElement("img")
    img.src = src
    img.draggable = false
    img.id = id
    return img
}

let randMap = rand(0, 100),
    minY = 0,
    maxX = 0,
    minX = 0,
    maxY = 0,
    money = 0,
    treasuresX = 0,
    treasuresY = 0,
    treasuresXArray = [],
    treasuresYArray = [],
    distanceTotreasures = 0,
    nextLevelVar = document.getElementById("nextLevel"),
    level = 1

nextLevelVar.style.display = "none"

localStorage.setItem("money", `${money}`)
selectedMap = setupMap(randMap)

document.getElementById("findtreasuresButton").style.top = `${treasuresY}px`
document.getElementById("findtreasuresButton").style.left = `${treasuresX}px`

function findtreasures() {
    money += 45000
    localStorage.setItem("money", `${money}`)
    document.getElementById("money").style.display = "block"
    const cross = createCross(treasuresX, treasuresY, 'red')
    document.body.appendChild(cross)
    treasuresXArray.push(treasuresX)
    newtreasuresCross()
    treasuresYArray.push(treasuresY)
    document.getElementById("distanceTotreasures").innerHTML = `Distance to treasures: 0px`
    document.getElementById("money").innerHTML = `Money: ${money}`
    findtreasuresVar = true
    nextLevelVar.style.display = "block"
}

function nextLevelFunction() {
    randMap = rand(0, 100)
    selectedMap = changeMap(randMap)

    selectedMapElement.addEventListener('click', event => {
        const rect = selectedMapElement.getBoundingClientRect(),
            x = (event.clientX - rect.left).toFixed(0),
            y = (event.clientY - rect.top).toFixed(0)
        clientXClick = event.clientX
        clientYClick = event.clientY
        if (!findtreasuresVar) {
            const cross = createCross(clientXClick, clientYClick, 'white')
            document.body.appendChild(cross)
        }

        distanceTotreasures = round(squareRoot(square(x - treasuresX) + square(y - treasuresY)))
        document.getElementById("distanceTotreasures").innerHTML = `Distance to treasures: ${distanceTotreasures}px`
        document.getElementById("coordinates").innerHTML = `Cursor: X: ${x}, Y: ${y}`
        document.getElementById("treasuresCoordinates").innerHTML = `treasures: X: ${treasuresX}, Y: ${treasuresY}`
    })
    newtreasuresCross()
    nextLevelVar.style.display = "none"
}

function newtreasuresCross() {
    switch (selectedMap) {
        case "firstMap":
            minY = 0
            minX = 0
            maxY = 694
            maxX = window.innerWidth
            break
        case "narnya":
        case "one-peace":
            minY = 77
            maxY = 626
            minX = 404
            maxX = 1111
            break
        default:
            selectedMap = "firstMap"
            minY = 0
            minX = 0
            maxY = 694
            maxX = window.innerWidth
            break
    }
    treasuresY = rand(minY, maxY)
    treasuresX = rand(minX, maxX)

    while (treasuresXArray.includes(treasuresX)) {
        treasuresX = rand(minX, maxX)
    }
    while (treasuresYArray.includes(treasuresY)) {
        treasuresY = rand(minY, maxY)
    }
    document.getElementById("findtreasuresButton").style.top = `${treasuresY}px`
    document.getElementById("findtreasuresButton").style.left = `${treasuresX}px`
}

function createCross(x, y, color) {
    const cross = document.createElement('div')
    cross.id = "cross"
    cross.style.left = `${x - 17}px`
    cross.style.top = `${y - 3}px`

    const first = document.createElement('div')
    first.id = "first"
    first.style.position = 'absolute'
    first.style.top = '-1px'
    first.style.width = '20px'
    first.style.height = '2px'
    first.style.backgroundColor = color

    const second = document.createElement('div')
    second.id = "second"
    second.style.width = '20px'
    second.style.height = '2px'
    second.style.backgroundColor = color

    cross.appendChild(first)
    cross.appendChild(second)

    return cross
}

selectedMapElement.addEventListener('click', event => {
    const rect = selectedMapElement.getBoundingClientRect(),
        x = (event.clientX - rect.left).toFixed(0),
        y = (event.clientY - rect.top).toFixed(0)
    clientXClick = event.clientX
    clientYClick = event.clientY

    if (!findtreasuresVar) {
        const cross = createCross(clientXClick, clientYClick, 'white')
        document.body.appendChild(cross)
    }

    distanceTotreasures = round(squareRoot(square(x - treasuresX) + square(y - treasuresY)))
    document.getElementById("distanceTotreasures").innerHTML = `Distance to treasures: ${distanceTotreasures}px`
    document.getElementById("coordinates").innerHTML = `Cursor: X: ${x}, Y: ${y}`
    document.getElementById("treasuresCoordinates").innerHTML = `treasures: X: ${treasuresX}, Y: ${treasuresY}`
})