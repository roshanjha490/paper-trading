import query from "./query";

export async function get_table_data_by_array({ table_name, where_array = {}, order_by, group_by = null, selected_field = null, find_num_rows = null, limit_no = null }) {
    try {

        let query_string = await new Promise((resolve, reject) => {

            let query = 'SELECT';

            if (selected_field == null) {
                query += ' *'
            } else {
                query += ' ' + selected_field
            }

            if (Object.keys(where_array).length > 0) {

                query += ' FROM ' + table_name + ' WHERE '

                let conditions = [];

                for (let key in where_array) {
                    conditions.push(`${key} = '${where_array[key]}'`);
                }

                query += conditions.join(' AND ');
            } else {
                query += ' FROM ' + table_name
            }

            query += ' ORDER BY ' + order_by

            if (group_by == null) {
                query += ''
            } else {
                query += ' GROUP BY ' + group_by
            }

            resolve(query)

        })

        const result = await query(query_string);
        return result;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

export async function insert_data_in_table({ table_name, data }) {

    try {

        let query_string = await new Promise(async (resolve, reject) => {

            let query = 'INSERT INTO '

            query += '`' + table_name + '` '

            let column_names = [];

            let table_headers = await data[0];

            for (let key in table_headers) {
                column_names.push('`' + key + '`');
            }

            query += '(' + column_names.join(', ') + ') VALUES ';

            let row_values = [];

            for (let elementPromise of data) {

                let element = await elementPromise;

                let column_values = [];

                for (let key in element) {
                    column_values.push(`'${element[key]}'`);
                }

                row_values.push('(' + column_values.join(', ') + ')');

            }

            query += row_values.join(', ')

            resolve(query)

        })

        const result = await query(query_string);
        return result;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

export async function run_raw_sql(sql) {

    try {
        const result = await query(sql);
        return result;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

export async function update_data_in_table({ table_name, where_array = {}, data = {} }) {

    try {

        let srch_query = {
            table_name: table_name,
            where_array: where_array,
            order_by: 'id'
        }

        let results = await get_table_data_by_array(srch_query)

        results = results[0]

        for (let result of results) {

            let query_string = await new Promise((resolve, reject) => {

                let query = 'UPDATE `' + table_name + '` SET ';

                let set_values = [];

                for (let key in data) {
                    set_values.push(`${key} = '${data[key]}'`);
                }

                query += set_values.join(', ');

                let conditions = [];

                for (let key in where_array) {
                    conditions.push(`${key} = '${where_array[key]}'`);
                }

                if (conditions.length > 0) {
                    query += ' WHERE ' + conditions.join(' AND ');
                }

                resolve(query);

            });

            const update_status = await query(query_string);

            if (update_status[0].hasOwnProperty('insertId')) {

                let data_after_updataion = await get_table_data_by_array({
                    table_name: table_name,
                    where_array: {
                        id: result.id
                    },
                    order_by: 'id'
                })

                let log_data = {
                    table_name: 'logs_master',
                    data: [{
                        table_name: table_name,
                        main_id_number: result.id,
                        data_before_updation: JSON.stringify(result),
                        data_after_updation: JSON.stringify(data_after_updataion[0][0])
                    }]
                }

                let log_entry = await insert_data_in_table(log_data)

                if (log_entry[0].hasOwnProperty('insertId')) {
                    return {
                        status: true,
                        updated_data: data_after_updataion[0][0]
                    }
                }
            } else {
                return {
                    status: false
                }
            }
        }

    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}