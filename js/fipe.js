var prefix = 'http://fipeapi.appspot.com/api/1/carros/';

var loadMotors = function() {
	React.render(
	        React.createElement(brandsBox, {url: prefix + 'marcas.json'}),
	        document.getElementById("mainHead")
	);	
}

var brandsBox = React.createClass({displayName: "BrandsBox",
	    getInitialState: function () {
	        return {data: []};
	    },
	    componentDidMount: function () {
	    	fetch(this.props.url, {  
	    	    method: 'GET'
	    	  }) 
	    	  .then((response) => {
	    		console.log('Request succeeded with JSON response', response);  		    	    
		        return response.json()
		      })
		      .then((data) => {
		        this.setState({ data: data })
		      })
	    	  ;
	    },
	    render: function () {
	    	if (typeof(this.state.data.error) != 'undefined' && this.state.data.error != null) {
	    		return (
			            React.createElement("div", {className: "brandBox"},
			            	React.createElement("label", {className: "labelForm"}, this.state.data.error)
			            	)
		        );  
	    	} else {
		        return (
			            React.createElement("div", {className: "brandBox"}, 
			                React.createElement("h1", null, "Marcas"), 
			                React.createElement(BrandList, {data: this.state.data})
			                )	
		        );
	    	}
	    }
});

var BrandList = React.createClass({displayName: "BrandList",
	getInitialState: function () {
        return {selected: ''};
    },
    onChange: function(event) {
      this.setState({selected: event.target.value});
    },
    render: function () {
    	   	
        var brandNodes = this.props.data.map(function (brand, index) {
            return (            		
                React.createElement(Brand, {brand: brand, key: index})
            );
        });
        return (
            React.createElement("select", {id: 'brands' , className: "brandList", onChange: findCarsByBrand },
                    React.createElement("option", {value: ''}, '-- Choose an Option --'),
            		brandNodes
            )
        );
    }
});

var Brand = React.createClass({displayName: "Brand",	
    render: function () {   	   	
        return (
            React.createElement("option", {className: "brand", value: this.props.brand.id }, this.props.brand.name)	               
            );
    }
});

var findCarsByBrand = function (selected){	
	React.render(
	        React.createElement(CarsBox, {url: prefix + 'veiculos/' + selected.target.value + '.json', brand: selected.target.value}),
	        document.getElementById("carsHead")
	);	
}


var CarsBox = React.createClass({displayName: "CarsBox",
	    getInitialState: function () {
	        return {data: []};
	    },
	    componentDidMount: function () {
	    	fetch(this.props.url, {  
	    	    method: 'GET'
	    	  }) 
	    	  .then((response) => {
	    		console.log('Request succeeded with JSON response', response);  		    	    
		        return response.json()
		      })
		      .then((data) => {
		        this.setState({ data: data , url :  this.props.url, brand: this.props.brand})
		      });
	    },
	    shouldComponentUpdate: function(nextProps, nextState) {
	    	if (nextProps.url != nextState.url) {
	    		fetch(nextProps.url, {  
		    	    method: 'GET'
		    	  }) 
		    	  .then((response) => {		    	    
			        return response.json()
			      })
			      .then((data) => {
			        this.setState({ data: data , url :  this.props.url , brand: this.props.brand})
			      });
	    	}
	    	return true;
	    },
	    render: function () {
	    	if (typeof(this.state.data.error) != 'undefined' && this.state.data.error != null) {
	    		return (
			            React.createElement("div", {className: "CarsBox"},
			            	React.createElement("label", {className: "labelForm"}, this.state.data.error)
			            	)
		        );  
	    	} else {
		        return (
			            React.createElement("div", {className: "CarsBox"}, 
			                React.createElement("h1", null, "Veiculos"), 
			                React.createElement(CarList, {data: this.state.data, brand: this.state.brand})
			                )	
		        );
	    	}
	    }
});

var CarList = React.createClass({displayName: "CarList",	
	render: function () {
		
		var brand = this.props.brand;
    	   	
        var brandNodes = this.props.data.map(function (car, index) {
            return (            		
                React.createElement(Car, {car: car, 'brand': brand, key: index})
            );
        });
        return (
        	React.createElement("div", {className: "datagrid" }, 
	            React.createElement("table", {id: 'cars'},
	            		 React.createElement("thead", null,   
	            	    		React.createElement("th", null, 'Marca'),
	                    	    React.createElement("th", null, 'Modelo'),
	                            React.createElement("th", null, 'Codigo')            	             	    
	            	     ),
	            	    React.createElement("tbody", {key: Math.random()}, '', 
	            		brandNodes
	            		)
	            )
	        )
        );
    }
});


var Car = React.createClass({displayName: "Car",
	getInitialState: function () {
        return {carId: ''};
    },
    onClick: function(event) {
      this.setState({carId: event.target.id});
    },
    render: function () {   	   	
        return (
	            React.createElement("tr", {id: this.props.brand + '/' + this.props.car.id, name: this.props.car.key, className: "cursorRow", onClick: showCarProperties },
		                React.createElement("td", null, this.props.car.marca),
		                React.createElement("td", null, this.props.car.name),
		                React.createElement("td", null, this.props.car.fipe_name)
	            )	               
            );
    }
}); 


var showCarProperties = function (carId){	
	React.render(
	        React.createElement(CarDetails, {id: carId.currentTarget.id}),
	        document.getElementById("carDetails")
	);	
}

var CarDetails = React.createClass({displayName: "CarDetails",
		getInitialState: function () {
        return {data: []};
      },
	    componentDidMount: function () {
	    	fetch(prefix + 'veiculo/' + this.props.id + '.json' , {  
	    	    method: 'GET'
	    	  }) 
	    	  .then((response) => {
	    		console.log('Request succeeded with JSON response', response);  		    	    
		        return response.json()
		      })
		      .then((data) => {
		        this.setState({ data: data , id: this.props.id})
		      })
	    	  ;
	  },
	   render: function() {		
		return (		
				React.createElement("div", {id: "carModal" , className: "modal showOverlay"},
						React.createElement("div", {className: "modal-dialog"}, 
								React.createElement("div", {className: "modal-content"}, 
										React.createElement("div", {className: "modal-header"}, "CARROS SELECIONADOS"),
										React.createElement("div", {className: "modal-body"}, 
												React.createElement(CarDetailItems, {data: this.state.data, id: this.state.id})
										),
										React.createElement("div", {className: "modal-footer"}, 
												React.createElement("button", {className: "btn btn-default", onClick: closeModal}, "Close")
										)
								)						
						)
			)
		
		);
		
	}
});

var CarDetailItems = React.createClass({displayName: "CarDetailItems",	
	render: function () {
		
		var id = this.props.id;
		
        var carItems = this.props.data.map(function (item, index) {
            return (            		
                React.createElement(CarDetail, {item: item, 'id': id, key: index})
            );
        });
        return (
        	React.createElement("div", {className: "datagrid" }, 
	            React.createElement("table", {id: 'cars'},
	            		 React.createElement("thead", null,   
	            	    		React.createElement("th", null, 'Marca'),
	                    	    React.createElement("th", null, 'Modelo'),
	                            React.createElement("th", null, 'Ano-Codigo')            	             	    
	            	     ),
	            	    React.createElement("tbody", {key: Math.random()}, '', 
	            	    	carItems
	            		)
	            ),
	            React.createElement("div", {id: "carPrice",  className: "carPriceBox" }, null)
	        )
        );
    }
});

var CarDetail = React.createClass({displayName: "CarDetail",
	getInitialState: function () {
        return {id: ''};
    },
    onClick: function(event) {
      this.setState({id: event.target.id});
    },
	render: function () {   	   	
        return (
	            React.createElement("tr", {id: this.props.id + '/' + this.props.item.fipe_codigo, title: this.props.item.veiculo, onClick: showCarPrice },
		                React.createElement("td", null, this.props.item.marca),
		                React.createElement("td", null, this.props.item.veiculo),
		                React.createElement("td", null, this.props.item.fipe_codigo)
	            )	               
            );
    }
}); 

var showCarPrice = function (id){	
	React.render(
	        React.createElement(CarPrice, {id: id.currentTarget.id}),
	        document.getElementById("carPrice")
	);	
}

var CarPrice = React.createClass({displayName: "CarPrice",
	getInitialState: function () {
        return {data: []};
      },
	    componentDidMount: function () {
	    	fetch(prefix + 'veiculo/' + this.props.id + '.json' , {  
	    	    method: 'GET'
	    	  }) 
	    	  .then((response) => {
	    		console.log('Request succeeded with JSON response', response);  		    	    
		        return response.json()
		      })
		      .then((data) => {
		        this.setState({ data: data , id: this.props.id})
		      })
	    	  ;
	  },
	  shouldComponentUpdate: function(nextProps, nextState) {
	    	if (nextProps.id != nextState.id) {
	    		fetch(prefix + 'veiculo/' + nextProps.id + '.json', {  
		    	    method: 'GET'
		    	  }) 
		    	  .then((response) => {		    	    
			        return response.json()
			      })
			      .then((data) => {
			        this.setState({ data: data , id :  this.props.id})
			      });
	    	}
	    	return true;
	    },
    render: function () {   	   	
        return (
        		
        		React.createElement("div", {className: "datagrid" }, 
        	            React.createElement("table", {id: 'cars'},
        	            		 React.createElement("thead", null,   
        	            	    		React.createElement("th", null, 'Data'),
        	                    	    React.createElement("th", null, 'Modelo'),
        	                            React.createElement("th", null, 'Combustivel'),
        	                            React.createElement("th", null, 'Preço')            	             	    
        	            	     ),
        	            	    React.createElement("tbody", {key: Math.random()}, '', 
        	            	    		 React.createElement("tr", null,
        	            			                React.createElement("td", null, this.state.data.referencia),
        	            			                React.createElement("td", null, this.state.data.name),
        	            			                React.createElement("td", null, this.state.data.combustivel),
        	            			                React.createElement("td", null, this.state.data.preco)
        	            		            )
        	            		)
        	            )
        	        )
            );
    }
});

var closeModal = function (){
	$('#carModal').remove();
}
