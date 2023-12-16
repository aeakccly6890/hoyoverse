import React, {useEffect} from 'react';
import * as THREE from 'three';

const Test = () => {
    const FOV = 45;
    useEffect(() => {
        const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 1, 500);
        const renderer = new THREE.WebGLRenderer();

        camera.position.set(0,0,100)
        camera.lookAt( 0, 0, 0 );

        const scene = new THREE.Scene();
        const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        const points = [];
        points.push( new THREE.Vector3( - 10, 0, 0 ) );
        points.push( new THREE.Vector3( 0, 10, 0 ) );
        points.push( new THREE.Vector3( 10, 0, 0 ) );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const line = new THREE.Line( geometry, material );
        scene.add( line );
        renderer.render( scene, camera );
        // const animate = () => {
        //     requestAnimationFrame(animate);
        //     renderer.render(scene, camera);
        // };
        // animate();
        document.body.appendChild(renderer.domElement);
    }, []);


    return (
        <div>
        </div>
    );
};

export default Test;
