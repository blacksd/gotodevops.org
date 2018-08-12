// Add button for Europe, US, etc.


Vue.component('sorting-filters', {
    template: `
        <div class="row">
            <div class="col-12">
                <div class="sorting-filters float-right">SORT BY: &nbsp;
                    <span v-for="(value, key, index) in sortingFilters" 
                          @click="sortConferences(value, key)"
                          :class="['sorting-filter', { active: value.active}]"
                    >{{ value.title }}<span v-if="index + 1 < numberOfFilters()">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    </span>
                </div>
            </div>
        </div>
    `,
    methods: {
        sortConferences: function(value, key) {
            // Set other filters active and asc values to false
            for (let filter in this.sortingFilters) {
                if (this.sortingFilters[filter].asc !== this.sortingFilters[key].asc) {
                    this.sortingFilters[filter].asc = false;
                }

                this.sortingFilters[filter].active = false;
            }

            this.sortingFilters[key].active = true;
            this.sortingFilters[key].asc = !this.sortingFilters[key].asc;

            this.$emit('apply-sorting', key, this.sortingFilters[key].asc);
        },
        // Not sure how to get length of object in a template,
        // hence this helper method.
        numberOfFilters: function () {
            return Object.keys(this.sortingFilters).length
        }
    },
    data() {
        return {
            sortingFilters: {
                startDate: {
                    title: 'DATE',
                    active: true,
                    asc: true
                },
                name: {
                    title: 'NAME',
                    active: false,
                    asc: false
                }
            }
        }
    }
});

Vue.component('month-buttons', {
    template: `
        <div class="row filter-group months">
            <div v-for="(value, key) in buttons" class="col-1">
                <div @click="applyMonths(value, key)"
                     :class="['month', 'filter', 'button', { active: value.active}]"
                >{{ value.title }}
                </div>
            </div>
        </div>
    `,
    methods: {
        applyMonths: function (value, key) {
            const index = this.months.indexOf(value.title);

            // Add or remove month from this.months array
            if (index === -1) {
                this.months.push(value.title);
            } else {
                this.months.splice(index, 1);
            }

            // Toggle the pressed button active value
            this.buttons[key].active = !this.buttons[key].active;


            this.$emit('apply-months', this.months);
        }
    },
    data() {
        return {
            months: [],
            buttons: {
                january: {
                    title: 'JAN',
                    active: false
                },
                february: {
                    title: 'FEB',
                    active: false
                },
                march: {
                    title: 'MAR',
                    active: false
                },
                april: {
                    title: 'APR',
                    active: false
                },
                may: {
                    title: 'MAY',
                    active: false
                },
                june: {
                    title: 'JUN',
                    active: false
                },
                july: {
                    title: 'JUL',
                    active: false
                },
                august: {
                    title: 'AUG',
                    active: false
                },
                september: {
                    title: 'SEP',
                    active: false
                },
                october: {
                    title: 'OCT',
                    active: false
                },
                november: {
                    title: 'NOV',
                    active: false
                },
                december: {
                    title: 'DEC',
                    active: false
                }
            }
        }
    }
});

Vue.component('conference', {
    props: {
        conference: {
            type: Object,
            required: true
        }
    },
    template: `
        <div class="conference">
            <a :href="'#' + slugify(conference.name) + '-' + slugify(conference.startDate)" class="conf-card" data-toggle="collapse">
                <div class="row">
                    <div class="col-sm-6 col-md-7">
                        <div class="name">{{ conference.name }}</div>
                        <div class="location text-muted city"><i class="fas fa-map-marker-alt"></i>&nbsp; {{
                            conference.location.city }}, {{ conference.location.country}}
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-5 details">
                        <div class="row">
                            <div class="col-md-7">
                                <div class="date">
                                    <div>📅 {{ conference.date }}</div>
                                </div>
                                <div class="cost">
                                    <div v-if="conference.cost === 0">💰 FREE</div>
                                    <div v-if="conference.cost === 1">💰 < $300 / day</div>
                                    <div v-if="conference.cost === 2">💰 < $600 / day</div>
                                    <div v-if="conference.cost === 3">💰 > $600 / day</div>
                                    <div v-if="conference.cost === 'unknown'">💰 ???</div>
                                </div>
                            </div>
                            <div class="col-md-5">
                                <div class="weather">
                                    <div v-if="conference.weather.day < 10">❄️️</div>
                                    <div v-if="conference.weather.day >= 10 && conference.weather.day < 20">⛅</div>
                                    <div v-if="conference.weather.day >= 20">☀️</div>
                                    <div class="temperature">{{ conference.weather.day }}℃ / {{ conference.weather.night }}℃</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
            <div class="collapse conf-details" :id="slugify(conference.name) + '-' + slugify(conference.startDate)">
                <a :href="conference.url" class="conf-url">Go to the conference website &raquo;️</a>
                <h3 v-if="conference.sessions.length > 0">SESSIONS</h3>
                <ul class="conf-sessions">
                    <li v-for="session in conference.sessions">
                    🗣️ {{ session.speaker }}: {{ session.title }}
                    </li>
                </ul>
            </div>
        </div>
    `,
    methods: {
        slugify: function(text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
        }
    }
});

Vue.component('weather-buttons', {
    template: `
        <div class="row filter-group">
            <div v-for="(value, key) in buttons" class="col-4">
                <div @click="applyWeather(value, key)"
                     :class="['filter', 'button', { active: value.active}]"
                >{{ value.title }}
                </div>
            </div>
        </div>
    `,
    methods: {
        applyWeather: function (value, key) {
            // Toggle the pressed button active value
            this.buttons[key].active = !this.buttons[key].active;

            // Set all other button active values to false
            for (let btn in this.buttons) {
                if (this.buttons[btn].title !== this.buttons[key].title) {
                    this.buttons[btn].active = false;
                }
            }

            if (this.buttons[key].active === false) {
                this.$emit('apply-weather', null, null);
            } else {
                this.$emit('apply-weather', value.temperature.low, value.temperature.high);
            }
        }
    },
    data() {
        return {
            buttons: {
                cold: {
                    title: '❄️ COLD',
                    active: false,
                    temperature: {
                        low: -100,
                        high: 9
                    }
                },
                mild: {
                    title: '🌤️ MILD',
                    active: false,
                    temperature: {
                        low: 10,
                        high: 19
                    }
                },
                warm: {
                    title: '☀️ WARM',
                    active: false,
                    temperature: {
                        low: 20,
                        high: 100
                    }
                }
            }
        }
    }
});

Vue.component('price-buttons', {
    template: `
        <div class="row filter-group">
            <div v-for="(value, key) in buttons" class="col-4">
                <div @click="applyPrice(value, key)"
                     :class="['filter', 'button', { active: value.active}]"
                >{{ value.title }}
                </div>
            </div>
        </div>
    `,
    methods: {
        applyPrice: function (value, key) {
            // Toggle the pressed button active value
            this.buttons[key].active = !this.buttons[key].active;

            // Set all other button active values to false
            for (let btn in this.buttons) {
                if (this.buttons[btn].title !== this.buttons[key].title) {
                    this.buttons[btn].active = false;
                }
            }

            // If the state of the pressed button is false after the press
            // set the global cost to null (i.e. don't apply any cost filter),
            // otherwise set it to the button value.
            if (this.buttons[key].active === false) {
                this.$emit('apply-price', null);
            } else {
                this.$emit('apply-price', value.cost);
            }
        }
    },
    data() {
        return {
            buttons: {
                free: {
                    title: '💰 FREE',
                    active: false,
                    cost: 0,
                },
                low: {
                    title: '💰 < $300 / day',
                    active: false,
                    cost: 1,
                },
                medium: {
                    title: '💰 < $600 / day',
                    active: false,
                    cost: 2,
                }
            }
        }
    }
});

const app = new Vue({
    el: '#app',
    data: {
        conferences: window.conferences,
        months: [],
        cost: null,
        temperature: {
            low: null,
            high: null
        },
        city: '',
        country: '',
        speaker: '',
        session: '',
        sortBy: 'startDate',
        sortOrder: 'asc',
        showPast: false
    },
    methods: {
        updateCost: function (costValue) {
            this.cost = costValue;
        },
        updateWeather: function (temperatureLow, temperatureHigh) {
            this.temperature.low = temperatureLow;
            this.temperature.high = temperatureHigh;
        },
        updateMonths: function (months) {
            this.months = months;
        },
        updateSorting: function(sortingFilter, sortingOrder) {
            this.sortBy = sortingFilter;
            this.sortOrder = sortingOrder ? 'asc' : 'desc';
        }
    },
    computed: {
        filteredConferences(sortBy) {
            return _.orderBy(this.conferences, this.sortBy, this.sortOrder).filter(conference => {
                let cityMatch = conference.location.city.toLowerCase().indexOf(this.city.toLowerCase()) > -1;
                let countryMatch = conference.location.country.toLowerCase().indexOf(this.country.toLowerCase()) > -1;
                let speakerMatch = false;
                let sessionMatch = false;
                let costMatch = false;
                let weatherMatch = false;
                let monthsMatch = true;
                let show = false;

                const confDate = new Date(conference.startDate * 1000);
                const dateNow = (new Date).getTime();
                const locale = 'en-us';
                const conferenceMonth = confDate.toLocaleString(locale, {month: "short"}).toUpperCase();

                if (confDate >= dateNow || this.showPast) {
                   show = true;
                }

                if (this.months.length === 0) {
                    monthsMatch = true;
                } else {
                    monthsMatch = this.months.indexOf(conferenceMonth) > -1;
                }


                if (this.temperature.low === null && this.temperature.high === null) {
                    weatherMatch = true;
                } else if (conference.weather.day >= this.temperature.low && conference.weather.day <= this.temperature.high) {
                    weatherMatch = true;
                }

                if (this.cost === null) {
                    costMatch = true;
                } else {
                    costMatch = conference.cost <= this.cost;
                }


                if (conference.sessions.length === 0 && this.speaker === '') {
                    speakerMatch = true;
                } else {
                    for (let session of conference.sessions) {
                        if (session.speaker.toLowerCase().indexOf(this.speaker.toLowerCase()) > -1) {
                            speakerMatch = true;
                            break;
                        }
                    }
                }

                if (conference.sessions.length === 0 && this.session === '') {
                    sessionMatch = true;
                } else {
                    for (let session of conference.sessions) {
                        if (session.title.toLowerCase().indexOf(this.session.toLowerCase()) > -1) {
                            sessionMatch = true;
                            break;
                        }
                    }
                }

                return show && cityMatch && countryMatch && costMatch && weatherMatch && monthsMatch && speakerMatch && sessionMatch;
            })
        }
    }
});

$('button[type="submit"]').click(function () {
    $('form.subscription').hide();
    $('.subscription-thank-you').fadeIn(2000);
})
