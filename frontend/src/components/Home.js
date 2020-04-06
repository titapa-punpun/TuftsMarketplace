import React from 'react';


class Home extends React.Component {
    /* creating constructor */
    constructor(props) {
        super(props);
    }

    fetch('http://127.0.0.1:5000/getAllItems',
    {method: 'GET'})
        .then(response => response.json)
        .then(
            console.log('no data', x)
            return('no data')
        )

        })


    render() {
            return (
                <div>
                    Hello
                </div>
            );
    }
}

export default Home;