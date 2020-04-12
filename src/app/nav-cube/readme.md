# 3D navigation cube

A helper 3D navigation cube to work with `ThreeJS` camera.

## API

```ts
import { NavCube } from 'nav-cube'
var navCubeParams = {
    frontImage: 'front.png',
    homePosition: {1, -1, 1},
    tween: true,
    top: 100, // 100 pixexls from the top
    left: -100, // 100 pixels from the right
    size: 64,
    showHome: true,
    highLight: true
}
var navCube = new NavCube(renderer, camera, navCubeParams);
```

- Create a new canvas and render there. This is the only way to add rendering stuff w/o having the user add code to his render method.

