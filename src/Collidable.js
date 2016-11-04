/**
 * CG Space Invaders
 * CG45179 16'17
 *
 * @author: Rui Ventura ( ist181045 )
 * @author: Diogo Freitas ( ist181586 )
 * @author: Sara Azinhal ( ist181700 )
 */

import { Object3D } from './lib/threejs/core/Object3D';
import { Box3 } from './lib/threejs/math/Box3';
import { Sphere } from './lib/threejs/math/Sphere';

class Collidable extends Object3D {

	constructor ( x, y, z ) {

		super();

		this.type = 'Collidable';

		this.updateBoundingBox = false;

		this.boundingBox    = new Box3();
		this.boundingSphere = new Sphere();

		this.position.set( x, y, z );

	}

	intersect ( other ) {

		let rSum = this.boundingSphere.radius + other.boundingSphere.radius;
		let distSq = this.boundingSphere.center.distanceToSquared( other.boundingSphere.center );

		if ( rSum * rSum >= distSq ) {

			let [ a, b ] = [ this.boundingBox, other.boundingBox ];

			return (a.min.x <= b.max.x && a.max.x >= b.min.x &&
				a.min.y <= b.max.y && a.max.y >= b.min.y &&
				a.min.z <= b.max.z && a.max.z >= b.min.z);

		}

		return false;

	}

	update () {

		if ( this.updateBoundingBox ) {

			this.updateBoundingBox = false;
			this.boundingBox.setFromObject( this );
			this.boundingBox.getBoundingSphere( this.boundingSphere );

		}

	}

}

export default Collidable;
