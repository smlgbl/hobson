# Express Job Display Server

Configure jobs (like node.io), as in scraping,(e.g. Jenkins) API results, daytime, motd, ...

See sample jobs definitions in ./jobs/

For use as a Jenkins build monitor, see ./jobs/config/jenkins.js

'url' and 'jobs' keys are mandatory, the rest is optional.
'jobs' can either be the string 'all' (self-explanatory) or an array of names that will be treated like a job name glob.
So a definition of 
   jobs: [ 'puppet' ]
will include jobs named 'puppet-check-master', 'check-puppet-master', aso. (It's a string.toLowerCase().indexOf() comparison)
So far there is no mechanism to exclude jobs from this glob. That's on the todo list though.

Default request interval is 30 secs, but can be adjusted using the 'interval' key (which is in milliseconds)
If your Jenkins requires authentication, provide the 'user' and 'pass' keys.
