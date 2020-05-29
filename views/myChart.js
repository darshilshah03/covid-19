let ch = document.getElementById("myChart").getContext("2d");

let chart = new chart(ch,{
    type : 'bar',
    data : {
        labels : ['Confirmed','Recovered','Deaths'],
        datasets : [
            {
                data : [165000.65000,4800]
            }
        ]
    },
    options : {}
});


console.log("Hello");