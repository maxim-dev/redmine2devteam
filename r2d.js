
(function() {
    var entries = [],
        now = new Date(),
        curr = [('0' + now.getDate()).slice(-2), ('0' + (now.getMonth() + 1)).slice(-2), now.getFullYear()].join('.');

    $('.list.time-entries tr').each(function(){
        var $this = $(this);

        if ($this.hasClass('odd')) {
            var entryKey = $this.find('td:first > strong').text();

            var entry = {
                date: entryKey == 'сегодня' ? curr : entryKey,
                projects: {}
            };

            var $tasks = $this.nextUntil('.odd', '.time-entry');

            $tasks.each(function() {
                var $this = $(this),
                    subject = $this.find('td.subject').html(),
                    taskKey = subject.match(/#(\d+)</)[1],
                    taskName = subject.match(/:\s(.+)$/)[1],
                    projectName = subject.match(/^(.+)\s\s-\s<a/)[1],
                    projectKey = projectName == 'work' ? taskKey : projectName,
                    time = parseFloat($this.find('span.hours.hours-int').text() + $this.find('span.hours.hours-dec').text());


                // group by project only if it is not 'work'

                if (!entry.projects[projectKey]) {

                    entry.projects[projectKey] = {
                        tasks: [],
                        totalTime: time
                    };

                    if (projectName == 'work') {
                        entry.projects[projectKey].name = taskName;
                    } else {
                        entry.projects[projectKey].name = projectName;
                        entry.projects[projectKey].tasks.push(taskKey);
                    }
                } else if (projectName == 'work') {
                    entry.projects[projectKey].totalTime += time;
                } else {

                    if (entry.projects[projectKey].tasks.indexOf(taskKey) == -1) {
                        entry.projects[projectKey].tasks.push(taskKey);                                   }

                    entry.projects[projectKey].totalTime += time;
                }

            });

            entries.push(entry);

        }


    });

    var str_repeate = function(str, num) {
        return new Array( num + 1 ).join(str);
    };

    // formating result

    var report = [];
    var grossTime = 0;

    entries.reverse();

    $.each(entries, function(index, entry) {

        var i = 0;

        $.each(entry.projects, function(index, project) {
            var tasks = project.tasks.length ? '(' + project.tasks.join(',') + ')' : null,
                date = i++ ? null : entry.date,
                indent = date ? 2 : 20;


            report.push([date, str_repeate(' ', indent), project.totalTime, "\t", project.name, ' ', tasks].join(''));

            grossTime += project.totalTime;
        });

    });

    report.push("\nTotal: " + grossTime);


    $('<textarea style="width: 100%; height: 250px;"></textarea>').html(report.join("\n")).prependTo('body');

})();

