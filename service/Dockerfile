FROM    golang:1.15
WORKDIR /go/src/app
COPY    ./src .
RUN     ["go", "install"]
EXPOSE  9000/tcp
CMD     ["service"]

