// TODO: Add a valiation step that validates the project name

// TODO: Create Sublime project files with folder exludes and whatnot

var generators = require('yeoman-generator');
var change_case = require('change-case');

function tpl(ctx, file) {
    return ctx.templatePath('../../../templates/'+file);
}

function copy(ctx, file, content, output_file) {
    var output_file = output_file || file;
    var content = content || undefined;
    if (content) {
        ctx.fs.copyTpl(
            tpl(ctx, file),
            ctx.destinationPath(output_file),
            content
        );
    } else {
        ctx.fs.copy(
            tpl(ctx, file),
            ctx.destinationPath(output_file)
        );
    }
}

module.exports = generators.Base.extend({
    initializing: function() {
    },

    prompting: function() {
        var done = this.async();
        this.prompt({
            type    : 'input',
            name    : 'name',
            message : 'Your project name (spaces not allowed)',
            default : this.appname // Default to current folder name
        }, function (answers) {
            this.config.set('projectname', answers.name);
            this.config.set('projectname_clean', change_case.snakeCase(answers.name));

            // this.log(this.config.get('projectname_clean'));

            done();
        }.bind(this));
    },

    writing: function() {
        copy(this, 'project.sublime-project',
                   this.config.getAll(),
                   this.config.get('projectname')+'.sublime-project');
        copy(this, 'browserify.js');
        copy(this, 'index.js');
        copy(this, 'libs.json');
        copy(this, 'package.json', this.config.getAll());

        copy(this, 'public/assets/fonts/boxy_bold_8.png');
        copy(this, 'public/assets/fonts/boxy_bold_8.xml');

        copy(this, 'public/config.json');
        copy(this, 'public/index.html', this.config.getAll());
        copy(this, 'public/style.css');

        copy(this, 'src/config.js');
        copy(this, 'src/main.js', this.config.getAll());
        copy(this, 'src/root.js',
                   this.config.getAll(),
                   'src/'+this.config.get('projectname_clean')+'.js');

        copy(this, 'src/states/boot.js');
        copy(this, 'src/states/game.js');
        copy(this, 'src/states/preloader.js');

        copy(this, 'src/utils/dom.js');
        copy(this, 'src/utils/type.js');

        copy(this, 'README.md', this.config.getAll());
    },

    install: function() {
        this.npmInstall(['phaser'], { 'save': true });

        // TODO: phaser-simple should only setup the minimum necessary,
        // while a separate generator should add this and the rest of the
        // project setup taken from Mountain King.

        this.npmInstall(['qwest'], {'save': true});

        this.npmInstall(['browserify@6.0.0'], {'saveDev': true});
        this.npmInstall(['node-static'], {'saveDev': true});
        this.npmInstall(['parallelshell'], {'saveDev': true});
        this.npmInstall(['remapify@1.3.0'], {'saveDev': true});
        this.npmInstall(['watch'], {'saveDev': true});
    },

    end: function() {
        this.log('Developing: npm run dev');
        this.log('Build: npm run build');
        this.log('Deploy to somewhere: npm run deploy');
    }
});
