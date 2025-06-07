export default function isValidUrl(urlString) {
    const urlPattern = /(https?:\/\/)?(www\.)?([\w-]+\.\w+)(\/[\w-]*)*/ig;
    const startWithProtocol = /(https?:\/\/).+/ig
    if (urlPattern.test(urlString)){
       return startWithProtocol.test(urlString) ? urlString : `http://${urlString}`; 
    } else return false;
};

//(https?:\/\/)?(www\.)?([\w-]+\.\w+)(\/[\w-]*)*
