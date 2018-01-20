export const getStorage = ({ storage }) => 
    (req, res) => res.send(JSON.stringify(storage.getData()))