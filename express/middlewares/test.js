const middle = function( ) {
	this.done = function( ) {};
	this.do = function( req, res ) {
		setTimeout((( ) => {
			// console.log( '\nmidleware were here!\n');
			this.done( req, res );
    }), 500 );
	}
};

module.exports = function( req, res, callback ) {
	let m = new middle();
	m.done = callback;
  m.do( req, res );
  return m;
}
