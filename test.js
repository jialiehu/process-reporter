'use strict';

var test = require('tape');
var setTimeout = require('timers').setTimeout;

var processReporter = require('./index');

test('processReporter reports libuv health', function t(assert) {
    var fakeStatsd = {
        records: [],
        timing: function timing(key, value) {
            this.records.push({
                key: key,
                value: value,
                type: 'timing'
            });
        },
        gauge: function gauge(key, value) {
            this.records.push({
                key: key,
                value: value,
                type: 'gauge'
            });
        }
    };

    var reporter = processReporter({
        handleInterval: 10,
        requestInterval: 10,
        statsd: fakeStatsd
    });
    reporter.bootstrap();

    setTimeout(onReported, 15);

    function onReported() {
        reporter.destroy();

        var records = fakeStatsd.records;
        var handles = records[0];
        var requests = records[1];

        assert.equal(records.length, 2);
        assert.equal(handles.key, 'process-reporter.handles');
        assert.equal(requests.key, 'process-reporter.requests');

        assert.equal(typeof handles.value, 'number');
        assert.equal(typeof requests.value, 'number');

        reporter.destroy();

        assert.end();
    }
});

test('processReporter prefix', function t(assert) {
    var fakeStatsd = {
        records: [],
        timing: function timing(key, value) {
            this.records.push({
                key: key,
                value: value,
                type: 'timing'
            });
        },
        gauge: function gauge(key, value) {
            this.records.push({
                key: key,
                value: value,
                type: 'gauge'
            });
        }
    };

    var reporter = processReporter({
        handleInterval: 10,
        requestInterval: 10,
        statsd: fakeStatsd,
        prefix: 'foobarbaz'
    });
    reporter.bootstrap();

    setTimeout(onReported, 15);

    function onReported() {
        reporter.destroy();

        var records = fakeStatsd.records;
        var handles = records[0];
        var requests = records[1];

        assert.equal(records.length, 2);
        assert.equal(handles.key, 'foobarbaz.process-reporter.handles');
        assert.equal(requests.key, 'foobarbaz.process-reporter.requests');

        assert.equal(typeof handles.value, 'number');
        assert.equal(typeof requests.value, 'number');

        reporter.destroy();

        assert.end();
    }
});

test('process reporter disable all', function t(assert) {
    var reporter = processReporter({
        handleEnabled: false,
        requestEnabled: false,
        memoryEnabled: false,
        lagEnabled: false,
        gcEnabled: false,
        statsd: {}
    });
    reporter.bootstrap();

    assert.strictEqual(reporter.handleTimer, null);
    assert.strictEqual(reporter.requestTimer, null);
    assert.strictEqual(reporter.memoryTimer, null);
    assert.strictEqual(reporter.lagTimer, null);
    assert.strictEqual(reporter._onStatsListener, null);

    // Don't teardown, test should exit
    assert.end();
});

test('process reporter disable all safely shuts down', function t(assert) {
    var reporter = processReporter({
        handleEnabled: false,
        requestEnabled: false,
        memoryEnabled: false,
        lagEnabled: false,
        gcEnabled: false,
        statsd: {}
    });
    reporter.bootstrap();

    assert.strictEqual(reporter.handleTimer, null);
    assert.strictEqual(reporter.requestTimer, null);
    assert.strictEqual(reporter.memoryTimer, null);
    assert.strictEqual(reporter.lagTimer, null);
    assert.strictEqual(reporter._onStatsListener, null);

    reporter.destroy();

    assert.end();
});
