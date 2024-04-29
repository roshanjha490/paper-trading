export function encode_url(val) {
    let encodedString = encodeURIComponent(Buffer.from(String(val)).toString('base64'));

    return encodedString

}


export function decode_url(val) {
    let decodedString = Buffer.from(decodeURIComponent(String(val)), 'base64').toString('utf-8');

    return decodedString
}
