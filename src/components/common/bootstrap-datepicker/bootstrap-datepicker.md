@parent wallet-ui
@module {can.Component} wallet-ui/components/common/bootstrap-datepicker <bootstrap-datepicker>

A short description of the bootstrap-datepicker component

@signature `<bootstrap-datepicker>`

@body

## Use

To insert date picker with options:
```
<bootstrap-datepicker options:from="datepickerOptions"></bootstrap-datepicker>
```

where your view model is defined like this:
```
const VM = DefineMap.extend({
  datepickerOptions: {
    type: '*',

    // Define any options for the datetimepicker here:
    // (Note: locale has to be imported 1st, see demo html)
    value () {
      return {
        locale: 'ru',
        defaultDate: '11/1/2013',
        disabledDates: [
          moment('12/25/2013'),
          new Date(2013, 11 - 1, 21),
          '11/22/2013 00:53'
        ]
      }
    }
  }
}
```
