# React Currency

# Table of contents

1. [Project description](#description)
2. [Installation instructions](#installation)
3. [Project structure](#structure)
4. [Screenshots](#screenshots)

## 1. Project description<a name="description"></a>

Currency is designed to convert one currency into another in order to check its corresponding value.

This react front project contact a Foreign exchange rates API. D

> https://exchangeratesapi.io/

Data are published hourly by the European Central Bank.

## 2. Installation instructions<a name="installation"></a>

Versions:

-   Node: 14.15.1
-   Npm: 6.14.8
-   React: 17.0.1

Download code from Github:

```shell
git clone https://github.com/antoineratat/react_currency.git
```

Navigate to project directory.

```shell
cd react_currency
```

Install node modules.

```shell
npm install
```

Run the app in development mode. Open http://localhost:3000 to view it in the browser.

```shell
npm start
```

## 3. Project structure<a name="structure"></a>

-   src
    -   App.js
    -   App.css
    -   fonts
    -   components
        -   currency
            -   Currency.js
            -   InformationCurrency.js
            -   InformationDate.js
            -   InputCurrency.js
            -   InputValue.js
            -   utils
                -   currenciesName.js
                -   fetchCurrency.js
                -   fetchHistoryCurrency.js
                -   fromCurrency.js
                -   genValues.js
                -   getDate.js
                -   getDateBefore.js
                -   getDatetime.js
                -   getRate.js
                -   sortDate.js
                -   toCurrency.js
        -   graph
            -   CurrencyGraph.js
            -   CurrencyGraph.module.css
            -   LineGraph.js
        -   loading
            -   LoadingSpinner.js

## 5. Screenshots<a name="screenshots"></a>

![Currency Screenshot](https://templars.guru/app/github/react_currency/1.PNG)
