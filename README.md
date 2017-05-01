# wiseconn-node

a small Node wrapper for the Wiseconn API

## Installation

### NPM

```bash
$ npm install wiseconn-node
```

## Usage

You must have a username and password supplied by Wiseconn in order to use most parts of the
API. Details about registering with Wiseconn can be found here:
http://www.wiseconn.com/platform/software/#plans

```js

import wiseconn from 'wiseconn-node';

const credentials = {
    username : 'myUsername',
    password : 'myPassword',
};

const dateRange = {
    initTime : 'my start date' // ex. '2017/03/01 01:00',
    endTime  : 'my end date'   // ex. '2017/03/31 01:00',
};

const client = new Wiseconn(credentials)

client.getMeasures()
    .then(() => {
        return client.getAllData(dateRange);
    }
    .catch(error => {
        console.log('error =', error);
    };

or

const client = new Wiseconn(credentials, dateRange);

client.getMeasures()
    .then(() => {
        return client.getAllData();
    }
    .catch(error => {
        console.log('error =', error);
    };

or in ES7 and Node 8:

const client = new Wiseconn(credentials)

getWiseconnData();

async function getWiseconnData() {
    try {
       await client.getMeasures();
       return await client.getAllData(dateRange);
    } catch(error) {
        console.log("error = ", error);
    }
}

or

const client = new Wiseconn(credentials, dateRange)

getWiseconnData();

async function getWiseconnData() {
    try {
       await client.getMeasures();
       return await client.getAllData();
    } catch(error) {
        console.log("error = ", error);
    }
}

```

As shown above, the date range can be passed in when creating
a new instance of the Wiseconn class, or when calling one of
its data request class methods. See the Wiseconn API docs for
more information about the query parameter options for each
request method and for the specific format that should be used for dates.


**`getMeasures()` must be called first.**

One or more of the following can be used to retrieve data:
`getAllData()`, `getData()`, `getLastData()`
None of them need to be called in any particular order.

`getStatus()` can be used to check whether the user's authentication
status is valid or invalid.

**Please consult The Wiseconn API documentation for any limits on the
number of queries allowed per session.

**

## API

### methods

See the Wiseconn API docs for the fields that each method returns.

```
wiseconn.getStatus();
```

Query Parameters: None

Returns `valid` if the authentication is valid and `invalid` if the authentication is invalid.


```
wiseconn.getMeasures();
```

Query Parameters: None

Returns a list of all the measures available to the User's Wiseconn account.

```
wiseconn.getData(requestMethod, query);
```

Query Parameters are optional. Pass them in as an object:

```
    {
        initTime    : String<yyyy/mm/dd hh>                 // The beginning date for querying the data.
        endTime     : String<yyyy/mm/dd hh>                 // The end date for querying the data.
        idOperation : number
        idInterval  : number
    }

```

`idOperation` takes a number code, where each number represents an operation to be performed on the data:
`0` returns the average value of the requested data series.
`1` returns the highest value in the requested data series.
`2` returns the lowest value in the requested data series.
`3` returns the sum of the requested data series.
`4` returns the total number of values in the requested data series.

`idInterval` takes a number code, where each number represents an interval for the operation
designated in `idOperation` above:
`0`: a one hour interval.
`1`: a one day interval.
`2`: a one month interval.

The `idInterval` should match the format of the `initTime` and `endTime` parameters.
If the `idInterval` is for one hour, then use the format: `yyyy/mm/dd hh`.
If the `idInterval` is for one day, then use the format: `yyyy/mm/dd`.
If the `idInterval` is for one month, then use the format: `yyyy/mm`.

You will get an error if they don't match.


```
wiseconn.getAllData(requestMethod, query);
```

Query Parameters are optional. Pass them in as an object:

```
    {
        initTime : String<yyyy/mm/dd hh:mi>           // The beginning date for querying the data.
        endTime  : String<yyyy/mm/dd hh:mi>           // The end date for querying the data.
    }

```

```
wiseconn.getLastData();
```

Query Parameters: None

Returns a list of the last data points for all the measures available to the User's Wiseconn account.

### Data

The actual data for each measure is stored on the `data` property
on measures retrieved by `getAllData()` or `getLastData()`.

```
    data : {
        time  : number,                             // the data point's timestamp
        value : string,                             // the data point's value
    }
```

### Error+

See the Wiseconn API documentation for a list of the different Wiseconn error types.
