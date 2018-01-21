/**
 * Parse profile.
 *
 * Parses user profiles as fetched from Goalify API.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function (json) {
    if ('string' == typeof json) {
        json = JSON.parse(json);
    }

    const profile = {};
    let i;
    let len;

    profile.id = json.id || json._id;
    profile.displayName = json.fullname;
    profile.name = {
        familyName: '',
        givenName: '',
    };

    if (json.fullname) {
        profile.name = {
            familyName: json.firstName,
            givenName: json.firstName,
            first: json.firstName,
            last: json.lastName,
        };
    }
    json.emails = json.email ? [json.email] : undefined;
    if (json.emails) {
        profile.emails = [];
        for (i = 0, len = json.emails.length; i < len; ++i) {
            profile.emails.push({ value: json.emails[i], type: 'account' });
        }
    }
    if (json.avatar) {
        profile.photos = [{ value: json.avatar }];
    }
    profile.gender = json.gender;

    return profile;
};
