define(function () {

    'use strict';

    // Declaration of states and their routes
    // This is actually not necessary if you don't have routes associated to states
    // But it is a good practice to do so, because it gives an overview of all the application states
    return {
        home: '/'
        /*shop: {
            $pattern: '/shop',
            index: '/',
            show: '/{id}',
            buy: {
                // If $fullPattern is used instead, it would be an absolure URL instead of relative
                $pattern: '/buy/{id}'
                // Constraints are useful to define rules for placeholders
                $constraints: {
                    id: /\d+/
                }
            }
        },*/
    };
});