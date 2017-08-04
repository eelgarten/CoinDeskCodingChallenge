/**
 * Created by Elias Elgarten on 8/3/2017.
 */

var currentPrices;
var pastPrices;
var currencies;
var currencyAmounts;

var submitForm = function () {

    var formFields = $('#inputCurrencyForm').serializeArray();

    var currencyValues = formFields.filter(function (entry) {
        return entry.value != 0;
    });

    currencies = [];
    currencyValues.filter(function (entry) {
        currencies.push(entry.name);
    });

    currencyAmounts = currencyValues;

    getCurrentCurrencyPrices();
};

function getCurrentCurrencyPrices() {
    return $.getJSON('/getCurrentCurrencyData/' + currencies).done(function (data) {
        currentPrices = data;

        getPastCurrencyPrices();
    });
}

function getPastCurrencyPrices () {
    return $.getJSON('/getPastCurrencyData/' + currencies).done(function (data) {
        pastPrices = data;

        calculateReturnPercentage();
    });
}

function calculateReturnPercentage () {
    var currentTotal = 0;
    var pastTotal = 0;

    currencyAmounts.forEach(function (item) {
        var itemName = item.name;
        var currentPrice = currentPrices.filter(function (currency) {
            return currency.name == itemName;
        });
        currentPrice = currentPrice[0].price;

        var pastPrice = pastPrices.filter(function (currency) {
            return currency.name == itemName;
        });
        pastPrice = pastPrice[0].price;

        var balance = item.value;

        currentTotal += currentPrice * balance;
        pastTotal += pastPrice * balance;

    });

    var difference = currentTotal - pastTotal;
    var returnPercentage = difference / pastTotal;
    
    displayReturnPercentage(returnPercentage * 100);
}

var displayReturnPercentage = function (returnPercentage) {
    var displayString = "24h Portfolio Return: ";

    if (returnPercentage > 0) {
        displayString += "+";
    }
    else if (returnPercentage < 0) {
        displayString += "-";
    }

    displayString += returnPercentage;
    displayString = "<span>" + displayString + "%" + "</span>"

    $('#results').html(displayString);
}


$(document).ready(function() {

    $('#clearButton').click(function() {
        $('#inputCurrencyForm')[0].reset();
    });

});


