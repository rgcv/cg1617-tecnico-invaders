/*global THREE*/

/**
 * CG Space Invaders
 * Game field - CG45179 16'17
 *
 * @author: Rui Ventura ( ist181045 )
 * @author: Diogo Freitas ( ist181586 )
 * @author: Sara Azinhal ( ist181700 )
 */

class Field extends THREE.Object3D {

	constructor( x, y, z, w = 250, l = 250 ) {

		super();

		this.type = 'Field';

		this._width  = w;
		this._length = l;

		this._buildField( 0, 0, 0 );
		
		this.position.set( x, y, z );

	}

	get width () {

		return this._width;

	}

	get length () {

		return this._length;

	}

	_buildFieldContents ( x, y, z ) {
		this.AShip = new AlliedShip( x, y + 10, z + 100 );;
		this.EShips = new Array();
		this.Bullets = new Array();

		let [ rows, columns ] = [ 2, 4 ];
		let [ xDist, zDist ] = [ -18.75 * ( columns - 1 ), -75 ];

		for ( let i = 0; i < rows; i++ ) {
			for ( let e = 0; e < columns; e++ ) {
				this.EShips.push( new EnemyShip( x + xDist, y + 10, z + zDist ) );
				xDist += 37.5;
			}
			zDist -= 25;
			xDist = -18.75 * ( columns - 1 );
		}
	}

	_buildField ( x, y, z ) {

		let w = this._width;
		let l = this._length;
		
		let leftBarrier = new THREE.Object3D();
		let rightBarrier = new THREE.Object3D();
		let bottomBarrier = new THREE.Object3D();
		let topBarrier = new THREE.Object3D();
		let barriers = new THREE.Group();

		let barrierMaterial = new THREE.MeshBasicMaterial( {
			color: new THREE.Color( 0xFFFFFF ),
			wireframe: false
		} );

		let floorMaterial = new THREE.MeshBasicMaterial( {
			color: new THREE.Color( 0x1A1A1A ),
			side: THREE.DoubleSide,
			wireframe: false
		} );

		this.children.splice( 0, this.children.length );

		this._addFloor( this, x, y, z, floorMaterial );
		this._addVerticalBarrier( leftBarrier, x + w / -2, y + 10, z, barrierMaterial ); barriers.add(leftBarrier);
		this._addVerticalBarrier( rightBarrier, x + w /  2, y + 10, z, barrierMaterial ); barriers.add(rightBarrier);
		this._addHorizontalBarrier( bottomBarrier, x, y + 10, z + l /  2, barrierMaterial ); barriers.add(topBarrier);
		this._addHorizontalBarrier( topBarrier, x, y + 10, z + l / -2, barrierMaterial ); barriers.add(bottomBarrier);

		this._buildFieldContents( x, y, z );

		this.add( barriers );
		this.add( this.AShip );
		for (var i = 0; i < this.EShips.length; i++) {
			this.add( this.EShips[i]);
		}

		this.lbbb = new THREE.Box3();
		this.lbbb.setFromObject(leftBarrier);
		this.rbbb = new THREE.Box3();
		this.rbbb.setFromObject(rightBarrier);
		this.bbbb = new THREE.Box3();
		this.bbbb.setFromObject(bottomBarrier);
		this.tbbb = new THREE.Box3();
		this.tbbb.setFromObject(topBarrier);

	}

	_addFloor ( obj, x, y, z, material ) {

		let geometry = new THREE.PlaneGeometry( this._width, this._length );
		let mesh = new THREE.Mesh( geometry, material );

		mesh.position.set( x, y, z );
		mesh.rotateX( Math.PI / -2 );

		obj.add( mesh );

	}

	_addVerticalBarrier ( obj, x, y, z, material ) {

		let geometry = new THREE.CubeGeometry( 4, 20, this._length );
		let mesh = new THREE.Mesh( geometry, material );

		mesh.position.set( x > 0 ? x - 2 : x + 2, y, z );

		obj.add( mesh );

	}

	_addHorizontalBarrier ( obj, x, y, z, material ) {

		let geometry = new THREE.CubeGeometry( this._width, 20, 4 );
		let mesh = new THREE.Mesh( geometry, material );

		mesh.position.set( x, y, z > 0 ? z - 2 : z + 2 );

		obj.add( mesh );

	}

}