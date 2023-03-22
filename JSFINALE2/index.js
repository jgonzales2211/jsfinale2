import platform from './img/platform.png'
import barrel from './img/barrel.png'
import background from './img/background.png'
import barrelSmall from './img/barrelSmall.png'

import spriteRunRight from './img/spriteRunRight.png'
import spriteStand from './img/spriteStand.png'
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024 
canvas.height = 756 

const gravity = 1.5 
class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100,
            y: 100,
        }
        this.velocity = {
            x: 0,
            y: 1,
        }
        this.width = 66
        this.height= 150
        this.image = createImage(spriteStand)
        this.frames = 0
        this.sprites = {
            stand: {
                right: createImage(spriteStand), 
                cropWidth: 26,
                width: 66
            } , 
            run: {
                right: createImage(spriteRunRight),
                cropWidth: 56,
                width: 172.875

            }
        }
        this.currentSprite = this.sprites.stand
        this.currentCropWidth = 26
    }
    draw() {
        c.drawImage(this.currentSprite, this.currentCrop * this.frames, 0, this.currentCrop , 55,  this.position.x, this.position.y,
            this.width, this.height)  
    }
    update() {
        this.frames++
        if(this.frames >28 )this.frames = 0
        this.draw()
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y 

        if(this.position.y + this.height + 
            this.velocity.y <= canvas.height)
        this.velocity.y += gravity
        
    }
}

class Platform {
    constructor({ x, y, image}) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height =  image.height
        
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}
class GenericObject {
    constructor({ x, y, image}) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height =  image.height
        
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}
function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc   
    return image
}
let platformImage = createImage(platform)
let barrelSmallImage = createImage(barrelSmall)


let player = new Player()
let platforms = []
let genericObjects = []


const keys = {
    right: { pressed: false
    },
    left: { pressed: false
    },
    }

let scrollOffset = 0

function init() {



platformImage = createImage(platform)


 player = new Player()
 platforms = [ new Platform({x: platform.width * 4 + 300 -2 + platform.width - barrelSmall.width, y:270, image: createImage(barrelSmall)}),
    new Platform({
    x:-1,
     y:470,
     image: platformImage

}), 
new Platform({x: platform.width -3, y: 470, image: platformImage}),
new Platform({x: platform.width * 2 + 100, y:470, image: platformImage}),
new Platform({x: platform.width * 3 + 300, y:470, image: platformImage}),
new Platform({x: platform.width * 4 + 300 -2, y:470, image: platformImage}),
new Platform({x: platform.width * 5 + 600 -2, y:470, image: platformImage}),]
genericObjects = [
    new GenericObject({
             x: -1,
                y: -1,
                image: createImage(background)
    }),
    new GenericObject({
        x: -1,
           y: -1,
           image: createImage(barrel)
}),
]


scrollOffset = 0
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })
    
    platforms.forEach((platform) => {
        platform.draw()
    })
player.update()

    if(keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100) ||
     keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
        player.velocity.x = -player.speed
    }else { 
        player.velocity.x = 0

if (keys.right.pressed) {
    scrollOffset += 5
    platforms.forEach((platform) => {
        platform.position.x -= player.speed
    })
    genericObjects.forEach(genericObject => {
        genericObject.position.x -= player.speed * 0.66
    })
    
} else if (keys.left.pressed) {
    scrollOffset -= player.speed
    platforms.forEach((platform) => {
        platform.position.x += player.speed
    })
    genericObjects.forEach(genericObject => {
        genericObject.position.x += player.speed * 0.66
    })
    
}
    }
    console.log(scrollOffset)
    platforms.forEach((platform) => {
    if(player.position.y + player.height <= platform.position.y && 
        player.position.y + player.height + player.velocity.y >= platform.position.y
        && player.position.x + player.width >= platform.position.x && player.position.x 
        <= platform.position.x + platform.width) 
        {
        player.velocity.y = 0
    }
})
if (scrollOffset > platform.width * 5 + 600 -2) {
    console.log('You Win')
} if (player.position.y > canvas.height) {
    init()
}
}

animate()

addEventListener('keydown', ({keyCode}) => {
    
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed= true
            break

            case 83:
            console.log('down')
            break

            case 68:
            console.log('right')
        keys.right.pressed = true
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
             break

            case 87:
            console.log('up')
            player.velocity.y -= 35
            break
    }
})

addEventListener('keyup', ({keyCode}) => {
    
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = false
            break

            case 83:
            console.log('down')
            break

            case 68:
            console.log('right')
            keys.right.pressed = false
             break

            case 87:
            console.log('up')
            player.velocity.y -= 20
            break
    }
})