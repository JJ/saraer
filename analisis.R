library(rjson)
library(stringr)

tickets <- fromJSON(file="data/tickets.json")

tickets.df <- data.frame( ID=character(), session=numeric(), talk=numeric())

for (i in 1:length(tickets)) {
 data <- (str_split(tickets[i],"/"))[[1]]
 
 tickets.df <- rbind(tickets.df,
                     data.frame(ID=data[7],
                                session=data[5],
                                talk=data[6]
                                ))
}
