import React from 'react';


class SearchItem extends React.Component {
    /* creating constructor */
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.loadData = this.loadData.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.loadData()
    }

    render() {
        return (
            <div>
                <form>
                    <label>
                    </label>>
                </form>
            </div>
        );
    }
}

export default SearchItem;