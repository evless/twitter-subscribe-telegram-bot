export const getStorage = ({ storage }) => 
    (req, res) =>
        storage
            .getAllChats()
            .then(result => res.send(JSON.stringify(result)))
            .catch(error => res.send(`Sorry! Error: ${error}`))